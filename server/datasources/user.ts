import { DataSource } from "apollo-datasource";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserInputError } from "apollo-server";
import dotenv from "dotenv";
import User from "../models/User";

dotenv.config();

class UserAPI extends DataSource {
  private context;

  initialize(config) {
    this.context = config.context;
    console.log(this.context);
  }

  async createUser({ name, username, email, password }) {
    try {
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

      const salt = await bcrypt.genSaltSync(12);

      const hash = await bcrypt.hash(password, salt);

      const newUser = new User({
        name: name,
        username: username,
        email: email,
        password: hash,
      });

      await newUser.save();

      const secretKey = process.env.JWT_SECRET;

      const token = jwt.sign(
        {
          username,
        },
        secretKey,
        {
          expiresIn: "1 day",
        }
      );

      return { token };
    } catch (error) {
      throw error;
    }
  }
}

export default UserAPI;
