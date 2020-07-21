export const resolvers = {
  Query: {
    feed: async (parent, args, { Quote }) => {
      const quotes = await Quote.find({}).exec();
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
