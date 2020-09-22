import { pubsub } from "../index";
import Quote from "../models/Quote";

const NEW_QUOTE = "NEW_QUOTE";

export const resolvers = {
  Subscription: {
    newQuote: {
      subscribe: () => pubsub.asyncIterator([NEW_QUOTE]),
    },
  },
  Query: {
    likes: async (parent, { id }, { dataSources }) => {
      const likes = await dataSources.quoteAPI.fetchLikesForQuote(id);

      return likes;
    },
    paths: async (parent, args, { dataSources }) => {
      const paths = await dataSources.quoteAPI.fetchPaths();

      return paths;
    },
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
      const quote = await dataSources.quoteAPI.createQuote({
        content,
        author,
        image,
        tags,
      });

      if (quote._id) {
        pubsub.publish(NEW_QUOTE, {
          newQuote: {
            id: quote._id,
            author: quote.author,
            content: quote.content,
            submittedBy: {
              id: quote.submittedBy._id,
              username: quote.submittedBy.username,
            },
            tags: quote.tags.map((tag) => {
              return { id: tag._id, name: tag.name };
            }),
            likes: [],
            slug: quote.slug,
          },
        });
      }

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
