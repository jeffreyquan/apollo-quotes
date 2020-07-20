import jwt from "jsonwebtoken";
import User from "../models/User";

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
