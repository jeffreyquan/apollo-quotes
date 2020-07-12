import Quote from "../models/Quote";

export const resolvers = {
  Mutation: {
    post: async ({ content, author, image }) => {
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
