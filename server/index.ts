import express from "express";
import mongoose from "mongoose";
import cloudinary from "cloudinary";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import { merge } from "lodash";
import { typeDefs } from "./schema";
import { resolvers as quoteResolvers } from "./resolvers/Quote";
import { resolvers as userResolvers } from "./resolvers/User";
import { resolvers as authResolvers } from "./resolvers/Auth";
import { resolvers as likeResolvers } from "./resolvers/Like";
import UserAPI from "./datasources/user";
import QuoteAPI from "./datasources/quote";
import TagAPI from "./datasources/tag";
import { verifyUser, AuthRequest } from "./middleware/auth";
import { initializeSeed } from "./seed";

mongoose.Promise = global.Promise;

const db = "mongodb://127.0.0.1/apollo-quotes";

const INIT_SEED = false;

const app = express();
app.use(cookieParser());
app.use("*", async function (req: AuthRequest, res, next) {
  const { token } = req.cookies;
  let user = null;
  if (token) user = await verifyUser(token);
  req.user = user;
  next();
});

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

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = new ApolloServer({
  typeDefs,
  resolvers: merge(authResolvers, quoteResolvers, userResolvers, likeResolvers),
  context: async ({ req, res }) => ({
    req,
    res,
  }),
  dataSources: () => ({
    userAPI: new UserAPI(),
    quoteAPI: new QuoteAPI(),
    tagAPI: new TagAPI(),
  }),
});

server.applyMiddleware({
  app,
  cors: {
    credentials: true,
    origin: true,
  },
});

const port = 5000;

app.listen({ port }, async () => {
  await connectDatabase();
  if (INIT_SEED) {
    await initializeSeed();
  }
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  );
});
