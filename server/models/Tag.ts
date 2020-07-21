import mongoose from "mongoose";
import { TagInterface } from "./Interfaces";

const { Schema } = mongoose;

const TagSchema = new Schema(
  {
    name: {
      type: String,
      required: "Tag name cannot be blank",
    },
  },
  { collection: "tag" }
);

const Tag = mongoose.model<TagInterface>("Tag", TagSchema);

export default Tag;
