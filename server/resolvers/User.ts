export const resolvers = {
  Query: {
    userProfile: async (parent, args, { dataSources }) => {
      const fetchedUserProfile = await dataSources.userAPI.fetchUserProfile();

      return fetchedUserProfile;
    },
  },
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
