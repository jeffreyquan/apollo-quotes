export const resolvers = {
  Query: {
    quotes: async (parent, { tag }, { dataSources }) => {
      const quotes = tag
        ? await dataSources.tagAPI.fetchQuotesByTagName(tag)
        : await dataSources.quoteAPI.fetchQuotes();
      return quotes;
    },
  },
  Mutation: {
    createQuote: async (
      parent,
      { content, author, image, tags },
      { dataSources }
    ) => {
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
