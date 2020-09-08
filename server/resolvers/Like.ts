import { pubsub } from "../index";

const NEW_LIKE = "NEW_LIKE";

export const resolvers = {
  Subscription: {
    newLike: {
      subscribe: () => pubsub.asyncIterator([NEW_LIKE]),
    },
  },
  Mutation: {
    likeQuote: async (parent, { quoteId }, { dataSources }) => {
      pubsub.publish(NEW_LIKE, { newLike: { quoteId } });
      const newLike = await dataSources.quoteAPI.likeQuote(quoteId);
      return newLike;
    },
  },
};
