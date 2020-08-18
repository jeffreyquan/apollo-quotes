import { DataSource } from "apollo-datasource";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { UserInputError, AuthenticationError } from "apollo-server";
import User from "../models/User";

dotenv.config();

class UserAPI extends DataSource {
  private context;

  initialize(config) {
    this.context = config.context;
  }

  generateToken(userId) {
    const secretKey = process.env.JWT_SECRET;
    return jwt.sign(
      {
        userId,
      },
      secretKey,
      {
        expiresIn: "1 day",
      }
    );
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

      const newUser = new User({
        name,
        username,
        email,
        password,
      });

      await newUser.save();

      delete newUser.password;

      const token = this.generateToken(newUser._id);

      this.context.res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 165,
      });

      return newUser;
    } catch (err) {
      throw err;
    }
  }

  async loginUser({ email, password }) {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      throw new UserInputError("User does not exist", {
        invalidArg: "email",
      });
    }

    const isEqual = bcrypt.compareSync(password, user.password);

    if (!isEqual) {
      throw new UserInputError("Password is incorrect", {
        invalidArg: "password",
      });
    }

    delete user.password;

    const token = await this.generateToken(user._id);

    this.context.res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 165,
    });

    return user;
  }

  async logoutUser() {
    this.context.res.clearCookie("token");
    return { message: "Successfully logged out" };
  }

  async fetchUserProfile() {
    const { user } = this.context.req;

    if (!user) return new AuthenticationError("User must be logged in");

    const userId = user._id;

    const fetchedUser = await User.findById(userId)
      .select("_id name username email likes quotes role")
      .populate({
        path: "quotes",
        populate: [
          {
            path: "likes",
            select: "_id user",
            populate: {
              path: "user",
              select: "username",
            },
          },
          {
            path: "tags",
          },
        ],
      })
      .populate({
        path: "likes",
        populate: [
          {
            path: "quote",
            populate: [
              {
                path: "likes",
                poulate: {
                  path: "user",
                  select: "username",
                },
              },
              {
                path: "tags",
              },
            ],
          },
        ],
      })
      .exec();

    return fetchedUser;
  }

  fetchUserById(userId) {
    return User.findOne({ _id: userId }).exec();
  }
}

export default UserAPI;
