import User from "../models/User";

export const resolvers = {
  Mutation: {
    login: async (parent, { email, password }, { dataSources }) => {
      const token = await dataSources.userAPI.loginUser({ email, password });
      return token;
    },
  },
};
