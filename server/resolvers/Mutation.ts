export const resolvers = {
  Mutation: {
    post: async (parent, { content, author, image }, { quote }) => {
      const newQuote = new quote({
        content,
        author,
        image,
      });

      await newQuote.save();
      return newQuote;
    },
  },
};
