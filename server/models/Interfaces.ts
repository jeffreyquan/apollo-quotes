import mongoose from "mongoose";

export interface QuoteInterface extends mongoose.Document {
  author: string;
  content: string;
  image: string;
  slug: string;
  user: UserInterface;
  likes: LikeInterface[];
  tags: TagInterface[];
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

export interface TagInterface extends mongoose.Document {
  name: string;
  quotes: QuoteInterface[];
}
