import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { UserInterface } from "./Interfaces";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: "Name cannot be blank",
    },
    username: {
      type: String,
      required: "Username cannot be blank",
      unique: true,
      minlength: [4, "Username must be between 4 to 16 characters"],
      maxlength: [16, "Username must be between 4 to 16 characters"],
    },
    email: {
      type: String,
      required: "Email cannot be blank",
      unique: true,
    },
    password: {
      type: String,
      required: "Password cannot be blank",
      minlength: [6, "Password must be at least 6 characters"],
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

const usernameValidator = function (username) {
  const regex = /^[a-zA-Z][a-zA-Z0-9_]{3,15}$/;
  return regex.test(username);
};

UserSchema.path("username").validate(
  usernameValidator,
  "Username must begin with a letter and be between 4 to 16 characters long"
);

const emailValidator = function (email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

UserSchema.path("email").validate(emailValidator, "Email in valid");

const nameValidator = function (name) {
  const regex = /^[A-Za-z]+((\s)?((\'|\-|\.)?([A-Za-z])+))*$/;
  return regex.test(name);
};

UserSchema.path("name").validate(nameValidator, "Name is invalid");

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
