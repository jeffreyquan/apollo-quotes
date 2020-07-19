import express from "express";
import mongoose from "mongoose";
import { ApolloServer } from "apollo-server-express";
import { merge } from "lodash";
import { typeDefs } from "./schema";
import { resolvers as quoteResolvers } from "./resolvers/Quote";
import { resolvers as userResolvers } from "./resolvers/User";
import UserAPI from "./datasources/user";
import Quote from "./models/Quote";
import Like from "./models/Like";
import User from "./models/User";

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
  resolvers: merge(quoteResolvers, userResolvers),
  context: () => ({
    Like,
    Quote,
    User,
  }),
  dataSources: () => ({
    userAPI: new UserAPI(),
  }),
});

server.applyMiddleware({ app });

const port = 5000;

app.listen({ port }, async () => {
  await connectDatabase();
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  );
});
