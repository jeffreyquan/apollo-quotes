import { pubsub } from "../index";
import { withFilter } from "apollo-server";

const NEW_LIKE = "NEW_LIKE";
const NEW_LIKE_ON_QUOTE = "NEW_LIKE_ON_QUOTE";

export const resolvers = {
  Subscription: {
    newLike: {
      subscribe: () => pubsub.asyncIterator([NEW_LIKE]),
    },
    newLikeOnQuote: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(NEW_LIKE_ON_QUOTE),
        (payload, variables) => {
          return payload.newLikeOnQuote.quote.id.toString() === variables.id;
        }
      ),
    },
  },
  Mutation: {
    likeQuote: async (parent, { quoteId }, { dataSources }) => {
      const newLike = await dataSources.quoteAPI.likeQuote(quoteId);

      if (newLike._id) {
        const like = (name) => ({
          [name]: {
            id: newLike._id,
            quote: {
              id: newLike.quote._id,
              likes: [...newLike.quote.likes],
            },
            user: {
              id: newLike.user._id,
              username: newLike.user.username,
            },
            createdAt: newLike.createdAt,
          },
        });

        pubsub.publish(NEW_LIKE, like("newLike"));

        pubsub.publish(NEW_LIKE_ON_QUOTE, like("newLikeOnQuote"));
      }

      return newLike;
    },
  },
};
