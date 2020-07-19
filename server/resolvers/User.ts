export const resolvers = {
  Mutation: {
    register: async (
      parent,
      { name, username, password, email },
      { dataSources }
    ) => {
      try {
        const newUser = await dataSources.userAPI.createUser({
          name,
          username,
          password,
          email,
        });
        return newUser;
      } catch (error) {
        throw error;
      }
    },
  },
};
