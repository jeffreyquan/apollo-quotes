import mongoose from "mongoose";
import Quote from "./Quote";
import User from "./User";
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

LikeSchema.post("deleteOne", { document: true }, function () {
  const like = this;

  // TODO: send response back to deleteOne call
  Promise.all([
    Quote.updateOne({ _id: like.quote }, { $pull: { likes: like._id } }).exec(),
    User.updateOne({ _id: like.user }, { $pull: { likes: like._id } }).exec(),
  ]).then((res) => console.log(res));
});

const Like = mongoose.model<LikeInterface>("Like", LikeSchema);

export default Like;
