import { DataSource } from "apollo-datasource";
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

  checkUserLoggedIn() {
    const { user } = this.context;

    if (!user) return new AuthenticationError("User must be logged in");

    return user;
  }

  initialize(config) {
    this.context = config.context;
  }

  fetchQuotes() {
    return Quote.find({}).exec();
  }

  fetchQuoteById(quoteId) {
    return Quote.findOne({ _id: quoteId }).exec();
  }

  async createPost({ content, author, image, tags }) {
    try {
      const user = this.checkUserLoggedIn();

      const slug = this.generateSlug(author, content);

      const existingQuote = await Quote.findOne({ slug }).exec();

      if (existingQuote)
        return new ApolloError("Quote already exists", "QUOTE_EXISTS");

      const [fetchedUser, existingTags] = await Promise.all([
        this.context.dataSources.userAPI.fetchUserById(user._id),
        this.context.dataSources.tagAPI.findTags(tags),
      ]);

      const newQuote = await new Quote({
        content,
        author,
        image,
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

  async likeQuote(quoteId) {
    try {
      const user = this.checkUserLoggedIn();

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

  async removeQuote(id) {
    try {
      const user = this.checkUserLoggedIn();

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
}

export default QuoteAPI;
