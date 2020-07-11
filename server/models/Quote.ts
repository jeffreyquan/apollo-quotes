import mongoose from "mongoose";
import { QuoteInterface } from "./Interfaces";

const { Schema } = mongoose;

const QuoteSchema = new Schema(
  {
    content: {
      type: String,
      required: "Quote cannot be blank",
    },
    author: {
      type: String,
      required: "Author cannot be blank",
    },
    image: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Like",
      },
    ],
  },
  { collection: "quote" }
);

const Quote = mongoose.model<QuoteInterface>("Quote", QuoteSchema);

export default Quote;
