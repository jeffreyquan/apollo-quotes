export const resolvers = {
  Query: {
    quotes: async (parent, { tag, limit, cursor }, { dataSources }) => {
      const quotes = await dataSources.quoteAPI.fetchQuotes({
        tag,
        limit,
        cursor,
      });
      return quotes;
    },
  },
  Mutation: {
    createQuote: async (
      parent,
      { content, author, image, largeImage, tags },
      { dataSources }
    ) => {
      const quote = await dataSources.quoteAPI.createQuote({
        content,
        author,
        image,
        largeImage,
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
