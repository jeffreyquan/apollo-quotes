import jwt from "jsonwebtoken";
import { Request } from "express";
import dotenv from "dotenv";
import User from "../models/User";

dotenv.config();

const secret = process.env.JWT_SECRET;

export const verifyUser = (token: string) => {
  return jwt.verify(token, secret, async (err, decoded) => {
    if (err) return null;
    const userId = decoded.userId;
    const user = await User.findOne({ _id: userId })
      .select("_id name username email role")
      .exec();
    return user;
  });
};

type User = {
  _id: string;
  name: string;
  username: string;
  email: string;
};

export interface AuthRequest extends Request {
  user?: User;
}
