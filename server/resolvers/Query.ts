import Quote from "../models/Quote";

export const resolvers = {
  Query: {
    feed: async () => {
      const quotes = await Quote.find({}).exec();

      return quotes;
    },
  },
};
