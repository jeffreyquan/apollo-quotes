import mongoose from "mongoose";
import bcrypt from "bcryptjs";
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
    role: {
      type: String,
      enum: ["ADMIN", "EDITOR", "USER"],
      default: "USER",
    },
    createdAt: Number,
    updatedAt: Number,
  },
  {
    timestamps: {
      currentTime: () => Math.floor(Date.now()),
    },
    collection: "user",
  }
);

UserSchema.pre<UserInterface>("save", function (next) {
  if (!this.isModified("password")) return next();

  const user = this;

  bcrypt.genSalt(12, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash;

      next();
    });
  });
});

const User = mongoose.model<UserInterface>("User", UserSchema);

export default User;
