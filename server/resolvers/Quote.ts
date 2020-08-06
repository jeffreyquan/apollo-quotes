export const resolvers = {
  Query: {
    quote: async (parent, { slug }, { dataSources }) => {
      const quote = await dataSources.quoteAPI.fetchQuote({
        slug,
      });
      return quote;
    },
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
