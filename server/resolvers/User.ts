export const resolvers = {
  Mutation: {
    register: async (
      parent,
      { name, username, password, email },
      { dataSources }
    ) => {
      try {
        const token = await dataSources.userAPI.createUser({
          name,
          username,
          password,
          email,
        });
        return token;
      } catch (error) {
        throw error;
      }
    },
  },
};
