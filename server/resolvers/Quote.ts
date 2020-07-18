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
    post: async (parent, { content, author, image }, { Quote }) => {
      const newQuote = new Quote({
        content,
        author,
        image,
      });

      await newQuote.save();
      return newQuote;
    },
  },
};
