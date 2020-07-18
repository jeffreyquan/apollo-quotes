import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserInputError } from "apollo-server";
import dotenv from "dotenv";

dotenv.config();

export const resolvers = {
  Mutation: {
    createUser: async (
      parent,
      { name, username, password, email },
      { User }
    ) => {
      const existingUsername = await User.findOne({ username }).exec();
      if (existingUsername) {
        throw new UserInputError("Username already exists", {
          invalidArg: "username",
        });
      }

      const existingEmail = await User.findOne({ email }).exec();

      if (existingEmail) {
        throw new UserInputError("Email already exists", {
          invalidArg: "email",
        });
      }

      const salt = await bcrypt.genSaltSync(10);

      const hash = await bcrypt.hash(password, salt);

      const newUser = new User({
        name: name,
        username: username,
        email: email,
        password: hash,
      });

      const result = await newUser.save();

      const secretKey = process.env.JWT_SECRET;

      const token = jwt.sign(
        {
          id: result._id,
          username: username,
          email: email,
        },
        secretKey,
        {
          expiresIn: "7d",
        }
      );

      return { userId: result._id, token };
    },
  },
};
