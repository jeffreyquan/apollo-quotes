export const resolvers = {
  Mutation: {
    login: async (parent, { email, password }, { dataSources }) => {
      const user = await dataSources.userAPI.loginUser({ email, password });
      return user;
    },
    logout: async (parent, args, { dataSources }) => {
      const res = await dataSources.userAPI.logoutUser();
      return res;
    },
  },
};
