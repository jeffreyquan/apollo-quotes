import mongoose from "mongoose";
import { QuoteInterface } from "./Interfaces";

const { Schema } = mongoose;

const QuoteSchema = new Schema(
  {
    content: {
      type: String,
      required: "Quote cannot be blank",
      unique: true,
    },
    author: {
      type: String,
      required: "Author cannot be blank",
    },
    image: {
      type: String,
    },
    slug: {
      type: String,
      required: "Slug cannot be blank",
      unique: true,
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Like",
      },
    ],
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
  },
  { collection: "quote" }
);

const Quote = mongoose.model<QuoteInterface>("Quote", QuoteSchema);

export default Quote;
