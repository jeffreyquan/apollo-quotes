export const resolvers = {
  Mutation: {
    login: async (parent, { email, password }, { dataSources }) => {
      const user = await dataSources.userAPI.loginUser({ email, password });
      return user;
    },
  },
};
