export const resolvers = {
  Query: {
    feed: async (parent, args, { quote }) => {
      const quotes = await quote.find({}).exec();
      return {
        quotes,
      };
    },
  },
};
