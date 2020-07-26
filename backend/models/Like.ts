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

LikeSchema.post("save", async function () {
  const like = this;

  await like
    .populate("user", "_id username")
    .populate({
      path: "quote",
      populate: [
        {
          path: "submittedBy",
          select: "_id username",
        },
        {
          path: "likes",
          select: "_id user",
          populate: {
            path: "user",
            select: "_id username",
          },
        },
        {
          path: "tags",
          select: "_id name",
        },
      ],
    })
    .execPopulate();

  return like;
});

LikeSchema.post("deleteOne", { document: true }, async function () {
  const like = this;

  // TODO: send response back to deleteOne call
  const deleteLikeFromQuoteAndUser = async () =>
    Promise.all([
      Quote.updateOne(
        { _id: like.quote },
        { $pull: { likes: like._id } }
      ).exec(),
      User.updateOne({ _id: like.user }, { $pull: { likes: like._id } }).exec(),
    ]);

  await deleteLikeFromQuoteAndUser();

  await like
    .populate("user", "_id username")
    .populate({
      path: "quote",
      populate: [
        {
          path: "submittedBy",
          select: "_id username",
        },
        {
          path: "likes",
          select: "_id user",
          populate: {
            path: "user",
            select: "_id username",
          },
        },
        {
          path: "tags",
          select: "_id name",
        },
      ],
    })
    .execPopulate();

  return like;
});

const Like = mongoose.model<LikeInterface>("Like", LikeSchema);

export default Like;
