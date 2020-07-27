export const resolvers = {
  Mutation: {
    likeQuote: async (parent, { quoteId }, { dataSources }) => {
      const newLike = await dataSources.quoteAPI.likeQuote(quoteId);

      return newLike;
    },
  },
};
