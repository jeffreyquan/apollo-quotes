import mongoose from "mongoose";

export interface QuoteInterface extends mongoose.Document {
  author: string;
  content: string;
  image: string;
  user: UserInterface;
  likes: LikeInterface[];
}

export interface UserInterface extends mongoose.Document {
  name: string;
  username: string;
  email: string;
  password: string;
  likes: LikeInterface[];
  quotes: QuoteInterface[];
}

export interface LikeInterface extends mongoose.Document {
  quote: QuoteInterface;
  user: UserInterface;
}
