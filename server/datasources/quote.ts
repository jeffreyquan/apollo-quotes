import { DataSource } from "apollo-datasource";
import Quote from "../models/Quote";
import Tag from "../models/Tag";
import Like from "../models/Like";
import { ApolloError, AuthenticationError } from "apollo-server";

class QuoteAPI extends DataSource {
  private context;

  initialize(config) {
    this.context = config.context;
  }

  async fetchQuotes() {
    const quotes = await Quote.find({}).exec();
    return quotes;
  }

  async fetchQuoteById(quoteId) {
    return await Quote.findOne({ _id: quoteId }).exec();
  }

  async createPost({ content, author, image, tags }) {
    const { user } = this.context;
    if (!user) return new AuthenticationError("User must be logged in");

    const slug = this.generateSlug(author, content);

    const existingQuote = await Quote.findOne({ slug }).exec();

    if (existingQuote)
      return new ApolloError("Quote already exists", "QUOTE_EXISTS");

    const fetchedUser = await this.context.dataSources.userAPI.fetchUserById(
      user._id
    );

    const newQuote = await new Quote({
      content,
      author,
      image,
    });

    newQuote.user = user._id;
    newQuote.slug = slug;

    const data = await this.context.dataSources.tagAPI.findTags(tags);

    for (let i = 0; i < data.length; i++) {
      if (!data[i]) {
        const newTag = new Tag({
          name: tags[i],
        });
        newTag.quotes.push(newQuote);
        newTag.save();
        newQuote.tags.push(newTag);
      } else {
        data[i].quotes.push(newQuote);
        data[i].save();
        newQuote.tags.push(data[i]);
      }
    }

    fetchedUser.quotes.push(newQuote);
    fetchedUser.save();
    newQuote.save();

    return newQuote;
  }

  async likeQuote(quoteId) {
    const { user } = this.context;
    if (!user) return new AuthenticationError("User must be logged in");

    const existingLike = await Like.findOne({
      user: user._id,
      quote: quoteId,
    }).exec();
    console.log(existingLike);

    if (existingLike) {
      const deletedLike = await existingLike.deleteOne();
      return deletedLike;
    }

    const newLike = new Like({
      quote: quoteId,
      user: user._id,
    });

    console.log(newLike);

    const fetchQuoteAndUser = async () =>
      Promise.all([
        this.fetchQuoteById(quoteId),
        this.context.dataSources.userAPI.fetchUserById(user._id),
      ]);

    const result = await fetchQuoteAndUser();
    const quote = result[0];
    const fetchedUser = result[1];

    quote.likes.push(newLike);
    fetchedUser.likes.push(newLike);

    // TODO: is there a better option than awaiting multiple saves like so
    await quote.save();
    await fetchedUser.save();
    await newLike.save();

    return newLike;
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
