export const resolvers = {
  Query: {
    feed: async (parent, args, { dataSources }) => {
      const quotes = await dataSources.quoteAPI.fetchQuotes();
      return {
        quotes,
      };
    },
    feedByTagName: async (parent, { name }, { dataSources }) => {
      const quotes = await dataSources.tagAPI.fetchQuotesByTagName(name);
      return {
        quotes,
      };
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
