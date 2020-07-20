import express from "express";
import mongoose from "mongoose";
import { ApolloServer } from "apollo-server-express";
import { merge } from "lodash";
import { typeDefs } from "./schema";
import { resolvers as quoteResolvers } from "./resolvers/Quote";
import { resolvers as userResolvers } from "./resolvers/User";
import { resolvers as authResolvers } from "./resolvers/Auth";
import UserAPI from "./datasources/user";
import { verifyUser } from "./middleware/auth";

mongoose.Promise = global.Promise;

const db = "mongodb://127.0.0.1/apollo-quotes";

const connectDatabase = () => {
  try {
    mongoose.set("useFindAndModify", false);
    mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("DB connected.");
  } catch (error) {
    console.log(error);
  }
};

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers: merge(authResolvers, quoteResolvers, userResolvers),
  context: async ({ req, res }) => {
    const token = req.headers.authorization || "";
    let user = null;
    if (token) user = await verifyUser(token);
    return { user };
  },
  dataSources: () => ({
    userAPI: new UserAPI(),
  }),
});

server.applyMiddleware({ app });

const port = 5000;

app.listen({ port }, async () => {
  connectDatabase();
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  );
});
