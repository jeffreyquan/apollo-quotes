export const resolvers = {
  Query: {
    feed: async (parent, args, { dataSources }) => {
      const quotes = dataSources.quoteAPI.fetchQuotes();
      return {
        quotes,
      };
    },
  },
  Mutation: {
    post: async (parent, { content, author, image, tags }, { dataSources }) => {
      const quote = await dataSources.quoteAPI.createPost({
        content,
        author,
        image,
        tags,
      });

      return quote;
    },
  },
};
