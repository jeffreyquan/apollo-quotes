export const resolvers = {
  Mutation: {
    like: async (parent, { quoteId }, { dataSources }) => {
      const newLike = await dataSources.quoteAPI.likeQuote(quoteId);

      return newLike;
    },
  },
};
