import { DataSource } from "apollo-datasource";
import cloudinary from "cloudinary";
import Quote from "../models/Quote";
import Tag from "../models/Tag";
import Like from "../models/Like";
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} from "apollo-server";

class QuoteAPI extends DataSource {
  private context;

  initialize(config) {
    this.context = config.context;
  }

  async fetchQuote({ slug }) {
    const quote = await Quote.findOne({ slug })
      .populate({
        path: "tags",
        select: "_id name",
      })
      .populate({
        path: "likes",
        select: "_id user",
        populate: {
          path: "user",
          select: "_id username",
        },
      })
      .populate({
        path: "submittedBy",
        select: "_id username",
      })
      .exec();

    return quote;
  }

  async fetchQuotes({ tag, limit = 4, cursor }) {
    const totalCount = await Quote.countDocuments({}).exec();

    let quotes = [];
    let endCursor = "";
    let filter = {};

    if (tag) {
      const fetchedTag = await Tag.findOne({ name: tag }).exec();
      if (fetchedTag) {
        const tagId = fetchedTag._id;
        filter = { tags: tagId };
      }
    }

    if (cursor)
      filter = { ...filter, createdAt: { $lt: this.decodeCursor(cursor) } };

    quotes = await Quote.find(filter)
      .sort({ createdAt: "descending", _id: "descending" })
      .limit(limit + 1)
      .populate({
        path: "tags",
        select: "_id name",
      })
      .populate({
        path: "likes",
        select: "_id user",
        populate: {
          path: "user",
          select: "_id username",
        },
      })
      .populate({
        path: "submittedBy",
        select: "_id username",
      })
      .exec();

    const hasMore = quotes.length > limit;

    quotes = hasMore ? (quotes = quotes.slice(0, -1)) : quotes;

    endCursor = this.encodeCursor(quotes[quotes.length - 1].createdAt);

    return {
      totalCount,
      pageInfo: {
        endCursor,
        hasMore,
      },
      quotes,
    };
  }

  fetchQuoteById(quoteId) {
    return Quote.findOne({ _id: quoteId }).exec();
  }

  async createQuote({ content, author, image, tags }) {
    try {
      const { user } = this.context.req;

      if (!user) return new AuthenticationError("User must be logged in");

      const slug = this.generateSlug(author, content);

      const existingQuote = await Quote.findOne({ slug }).exec();

      if (existingQuote)
        return new ApolloError("Quote already exists", "QUOTE_EXISTS");

      const [fetchedUser, existingTags] = await Promise.all([
        this.context.dataSources.userAPI.fetchUserById(user._id),
        this.context.dataSources.tagAPI.findTags(tags),
      ]);

      const images = await this.uploadImage(image);

      const newQuote = await new Quote({
        content,
        author,
        ...images,
      });

      newQuote.submittedBy = user._id;
      newQuote.slug = slug;

      for (let i = 0; i < existingTags.length; i++) {
        if (!existingTags[i]) {
          const newTag = new Tag({
            name: tags[i],
          });
          newTag.quotes.push(newQuote);
          await newTag.save();
          newQuote.tags.push(newTag);
        } else {
          existingTags[i].quotes.push(newQuote);
          await existingTags[i].save();
          newQuote.tags.push(existingTags[i]);
        }
      }

      fetchedUser.quotes.push(newQuote);

      await Promise.all([fetchedUser.save(), newQuote.save()]);

      return newQuote;
    } catch (err) {
      return new Error("Internal server error");
    }
  }

  async uploadImage(image) {
    const images = {
      image: "",
      largeImage: "",
    };
    await cloudinary.v2.uploader.upload(
      image,
      {
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      },
      (err, res) => {
        if (err) console.log(err);
        images.image = res.secure_url;
        images.largeImage = res.eager[0].secure_url;
      }
    );

    return images;
  }

  async likeQuote(quoteId) {
    try {
      const { user } = this.context.req;

      if (!user) return new AuthenticationError("User must be logged in");

      const existingLike = await Like.findOne({
        user: user._id,
        quote: quoteId,
      }).exec();

      if (existingLike) {
        const deletedLike = await existingLike.deleteOne();
        return deletedLike;
      }

      const newLike = new Like({
        quote: quoteId,
        user: user._id,
      });

      const [quote, fetchedUser] = await Promise.all([
        this.fetchQuoteById(quoteId),
        this.context.dataSources.userAPI.fetchUserById(user._id),
      ]);

      quote.likes.push(newLike);
      fetchedUser.likes.push(newLike);

      await Promise.all([quote.save(), fetchedUser.save(), newLike.save()]);

      return newLike;
    } catch (err) {
      return new Error("Internal server error");
    }
  }

  async updateQuote(updates) {
    try {
      const { user } = this.context.req;

      if (!user) return new AuthenticationError("User must be logged in");

      const id = updates.id;

      const quote = await Quote.findById(id)
        .populate("tags")
        .populate({
          path: "submittedBy",
          select: "_id username",
        })
        .exec();

      quote.content = updates.content;
      quote.author = updates.author;
      quote.image = updates.image;

      const existingTags = quote.tags.map((tag) => tag.name);

      const newTags = [];
      const removedTags = [];

      existingTags.forEach((tag) => {
        if (!updates.tags.includes(tag)) {
          removedTags.push(tag);
        }
      });

      updates.tags.forEach((tag) => {
        if (!existingTags.includes(tag)) {
          newTags.push(tag);
        }
      });

      const newTagsForQuote = await Promise.all(
        newTags.map((tag) =>
          Tag.findOneAndUpdate(
            { name: tag },
            { $push: { quotes: quote } },
            { new: true, upsert: true }
          ).exec()
        )
      );

      const keptTags = quote.tags.filter(
        (tag) => !removedTags.includes(tag.name)
      );

      const updatedTags = [...keptTags, ...newTagsForQuote];
      quote.tags = updatedTags;

      if (removedTags.length > 0) {
        const tagsremoved = await Promise.all(
          removedTags.map((tag) =>
            Tag.updateOne(
              { name: tag },
              { $pull: { quotes: quote._id } },
              { new: true, multi: true }
            ).exec()
          )
        );
      }

      await quote.save();

      return quote;
    } catch (err) {
      return new Error("Internal server error");
    }
  }

  async deleteQuote(id) {
    try {
      const { user } = this.context.req;

      if (!user) return new AuthenticationError("User must be logged in");

      const quote = await Quote.findById(id).exec();

      if (quote.submittedBy.toString() !== user._id.toString()) {
        return new ForbiddenError("Quote does not belong to user");
      }

      const deletedQuote = await quote.deleteOne();

      return deletedQuote;
    } catch (err) {
      return new Error("Internal server error");
    }
  }

  generateSlug(author: string, content: string): string {
    const authorSlug = author
      .replace(/[^a-zA-Z ]/g, "")
      .split(" ")
      .join("-")
      .toLowerCase();

    const contentSlug = content
      .replace(/[^a-zA-Z ]/g, "")
      .split(" ")
      .slice(0, 4)
      .join("-")
      .toLowerCase();

    return `${authorSlug}-${contentSlug}`;
  }

  encodeCursor(date) {
    return Buffer.from(date.toString()).toString("base64");
  }

  decodeCursor(encodedCursor) {
    return Buffer.from(encodedCursor, "base64").toString("ascii");
  }
}

export default QuoteAPI;
