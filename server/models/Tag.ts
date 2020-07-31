import mongoose from "mongoose";
import { TagInterface } from "./Interfaces";

const { Schema } = mongoose;

const TagSchema = new Schema(
  {
    name: {
      type: String,
      required: "Tag name cannot be blank",
      unique: true,
    },
    quotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Quote",
      },
    ],
  },
  { timestamps: true, collection: "tag" }
);

const Tag = mongoose.model<TagInterface>("Tag", TagSchema);

export default Tag;
