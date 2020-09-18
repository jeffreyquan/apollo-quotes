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
      const newLike = await dataSources.quoteAPI.likeQuote(quoteId);

      if (newLike._id) {
        pubsub.publish(NEW_LIKE, {
          newLike: {
            id: newLike._id,
            quote: {
              id: newLike.quote._id,
              likes: [...newLike.quote.likes],
            },
            user: {
              id: newLike.user._id,
              username: newLike.user.username,
            },
          },
        });
      }

      return newLike;
    },
  },
};
