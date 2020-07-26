import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User";

dotenv.config();

const secret = process.env.JWT_SECRET;

export const verifyUser = (token: string) => {
  return jwt.verify(token, secret, async (err, decoded) => {
    if (err) return null;
    const username = decoded.username;
    const user = await User.findOne({ username })
      .select("_id name username email")
      .exec();
    return user;
  });
};
