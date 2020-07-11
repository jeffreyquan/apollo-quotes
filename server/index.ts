import express from "express";
import mongoose from "mongoose";
import { ApolloServer } from "apollo-server-express";
import { merge } from "lodash";
import { typeDefs } from "./schema";

mongoose.Promise = global.Promise;

const db = "mongodb://127.0.0.1/apollo-quotes";

mongoose.set("useFindAndModify", false);
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB connected."))
  .catch((err) => console.log(err));

const server = new ApolloServer({ typeDefs });

const app = express();

server.applyMiddleware({ app });

const port = 5000;

app.listen(port, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
