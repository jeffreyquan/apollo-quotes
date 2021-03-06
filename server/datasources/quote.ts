import { DataSource } from "apollo-datasource";
import cloudinary from "cloudinary";
import Quote from "../models/Quote";
import Tag from "../models/Tag";
import Like from "../models/Like";
import User from "../models/User";
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

  async fetchLikesForQuote(id) {
    const likes = await Quote.findById(id)
      .populate({
        path: "likes",
        select: "_id user createdAt",
        populate: {
          path: "user",
          select: "_id username",
        },
      })
      .select("likes -_id")
      .exec();

    return likes.likes;
  }

  async fetchPaths() {
    const paths = await Quote.find({}).select("slug").exec();

    return paths;
  }

  async fetchQuote({ slug }) {
    const quote = await Quote.findOne({ slug })
      .populate({
        path: "tags",
        select: "_id name",
      })
      .populate({
        path: "likes",
        select: "_id user createdAt",
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

  async fetchQuotes({ tag, limit = 4, cursor, submittedBy, likedBy }) {
    let totalCount = 0;
    let quotes = [];
    let endCursor = "";
    let filter = {};
    let type = "feed";

    if (tag) {
      const fetchedTag = await Tag.findOne({ name: tag }).exec();
      if (fetchedTag) {
        const tagId = fetchedTag._id;
        filter = { tags: tagId };
      }
    }

    const { user } = this.context.req;

    if (submittedBy) {
      if (!user) {
        if (!user) return new AuthenticationError("User must be logged in");
      }

      if (user && submittedBy.toString() !== user._id.toString()) {
        return new ForbiddenError("User not authorised");
      }

      filter = { ...filter, submittedBy };
    }

    if (cursor)
      filter = { ...filter, createdAt: { $lt: this.decodeCursor(cursor) } };

    if (likedBy) {
      if (!user) {
        if (!user) return new AuthenticationError("User must be logged in");
      }

      if (user && likedBy.toString() !== user._id.toString()) {
        return new ForbiddenError("User not authorised");
      }

      const res = await this.fetchLikedQuotes({
        likedBy,
        limit,
        cursor,
      });

      totalCount = await (await User.findById(user._id).select("likes").exec())
        .likes.length;

      const { likes } = res;

      quotes = likes.map((x) => x.quote);

      type = "likes";

      const updatedLikes = likes.length > limit ? likes.slice(0, -1) : likes;

      if (updatedLikes.length > 0) {
        endCursor = this.encodeCursor(
          updatedLikes[updatedLikes.length - 1].createdAt
        );
      } else {
        endCursor = cursor;
      }
    } else {
      quotes = await Quote.find(filter)
        .sort({ createdAt: "descending", _id: "descending" })
        .limit(limit + 1)
        .populate({
          path: "tags",
          select: "_id name",
        })
        .populate({
          path: "likes",
          select: "_id user createdAt",
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

      totalCount = await Quote.countDocuments({}).exec();
    }

    const hasMore = quotes.length > limit;

    quotes = hasMore ? quotes.slice(0, -1) : quotes;

    if (type === "feed") {
      if (quotes.length > 0) {
        endCursor = this.encodeCursor(quotes[quotes.length - 1].createdAt);
      } else {
        endCursor = cursor;
      }
    }
    return {
      totalCount,
      pageInfo: {
        endCursor,
        hasMore,
      },
      quotes,
    };
  }

  async fetchLikedQuotes({ likedBy, limit, cursor }) {
    const { user } = this.context.req;

    if (!user) return new AuthenticationError("User must be logged in");

    const userId = user._id;

    let filter = {};

    if (cursor) {
      filter = {
        createdAt: { $lt: parseInt(this.decodeCursor(cursor)) },
      };
    }

    const quotes = await User.findById(userId)
      .select("likes")
      .populate({
        path: "likes",
        select: "createdAt quote -_id",
        options: {
          sort: { createdAt: "descending", _id: "descending" },
          limit: limit + 1,
        },
        match: {
          ...filter,
        },
        populate: [
          {
            path: "quote",
            populate: [
              {
                path: "likes",
                select: "_id user createdAt",
                populate: {
                  path: "user",
                  select: "_id username",
                },
              },
              {
                path: "tags",
                select: "_id name",
              },
              {
                path: "submittedBy",
                select: "_id username",
              },
            ],
          },
        ],
      })
      .exec();

    return quotes;
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

      // TODO: correct type for images instead of using any
      let images;

      if (image) {
        images = await this.uploadImage(image);
      }

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
            name: tags[i].toLowerCase(),
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

      const populatedQuote = await newQuote
        .populate({
          path: "tags",
          select: "_id name",
        })
        .populate({
          path: "likes",
          select: "_id user createdAt",
          populate: {
            path: "user",
            select: "_id username",
          },
        })
        .populate({
          path: "submittedBy",
          select: "_id username",
        })
        .execPopulate();

      return populatedQuote;
    } catch (err) {
      return new Error("Internal server error");
    }
  }

  async uploadImage(image) {
    const images = {
      image: "",
      largeImage: "",
    };

    const { createReadStream } = await image;

    const stream = createReadStream();

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        },
        function (err, res) {
          if (err) reject(err);
          if (res) {
            images.image = res.secure_url;
            images.largeImage = res.eager[0].secure_url;
            resolve(images);
          }
        }
      );

      stream.pipe(uploadStream);
    });
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

      if (user.id !== quote.submittedBy._id.toString()) {
        return new ForbiddenError("User not authorised");
      }

      quote.content = updates.content;
      quote.author = updates.author;
      quote.slug = this.generateSlug(updates.author, updates.content);

      const existingTags = quote.tags.map((tag) => tag.name);

      const newTags = [];
      const removedTags = [];

      existingTags.forEach((tag) => {
        const tagName = tag.toLowerCase();
        if (!updates.tags.includes(tagName)) {
          removedTags.push(tagName);
        }
      });

      updates.tags.forEach((tag) => {
        const tagName = tag.toLowerCase();
        if (!existingTags.includes(tagName)) {
          newTags.push(tagName);
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
        await Promise.all(
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

      const imageURL = quote.image;

      const publicId = imageURL
        .match(/apollo-quotes\/(.*)/)[0]
        .match(/(.*).jpg/)[1];

      cloudinary.v2.uploader.destroy(publicId, function (err, res) {
        if (err) console.log(err);

        if (res) console.log("Image successfully deleted");
      });

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
