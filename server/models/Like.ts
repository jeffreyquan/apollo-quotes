import mongoose from "mongoose";
import { LikeInterface } from "./Interfaces";

const { Schema } = mongoose;

const LikeSchema = new Schema(
  {
    quote: {
      type: Schema.Types.ObjectId,
      ref: "Quote",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { collection: "like" }
);

const Like = mongoose.model<LikeInterface>("Like", LikeSchema);

export default Like;
