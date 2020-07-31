import mongoose from "mongoose";
import { UserInterface } from "./Interfaces";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: "User name cannot be blank",
    },
    username: {
      type: String,
      required: "Username cannot be blank",
      unique: true,
    },
    email: {
      type: String,
      required: "Email cannot be blank",
      unique: true,
    },
    password: {
      type: String,
      required: "Password cannot be blank",
    },
    quotes: [{ type: Schema.Types.ObjectId, ref: "Quote" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
  },
  { timestamps: true, collection: "user" }
);

const User = mongoose.model<UserInterface>("User", UserSchema);

export default User;
