import { pubsub } from "../index";

const NEW_QUOTE = "NEW_QUOTE";

export const resolvers = {
  Subscription: {
    newQuote: {
      subscribe: () => pubsub.asyncIterator([NEW_QUOTE]),
    },
  },
  Query: {
    quote: async (parent, { slug }, { dataSources }) => {
      const quote = await dataSources.quoteAPI.fetchQuote({
        slug,
      });
      return quote;
    },
    quotes: async (
      parent,
      { tag, limit, cursor, submittedBy, likedBy },
      { dataSources }
    ) => {
      const quotes = await dataSources.quoteAPI.fetchQuotes({
        tag,
        limit,
        cursor,
        submittedBy,
        likedBy,
      });

      return quotes;
    },
  },
  Mutation: {
    createQuote: async (
      parent,
      { content, author, image, tags },
      { dataSources }
    ) => {
      // pubsub.publish(NEW_QUOTE, { newQuote: { content, author, image, tags } });
      const quote = await dataSources.quoteAPI.createQuote({
        content,
        author,
        image,
        tags,
      });

      return quote;
    },
    updateQuote: async (parent, args, { dataSources }) => {
      const updatedQuote = await dataSources.quoteAPI.updateQuote(args);

      return updatedQuote;
    },
    deleteQuote: async (parent, { id }, { dataSources }) => {
      const deletedQuote = await dataSources.quoteAPI.deleteQuote(id);

      return deletedQuote;
    },
  },
};
