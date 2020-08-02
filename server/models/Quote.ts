import mongoose from "mongoose";
import Like from "./Like";
import User from "./User";
import Tag from "./Tag";
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
    largeImage: {
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
    createdAt: Number,
    updatedAt: Number,
  },
  {
    timestamps: {
      currentTime: () => Math.floor(Date.now()),
    },
    collection: "quote",
  }
);

QuoteSchema.post("deleteOne", { document: true }, async function () {
  const quote = this;

  const updateTagsWithThisQuote = quote.tags.map((id) =>
    Tag.updateOne({ _id: id }, { $pull: { quotes: quote._id } }).exec()
  );

  const allLikes = await Like.find({ quote }).exec();

  const updateUsers = allLikes.map((like) =>
    User.updateOne(
      { _id: like.user },
      {
        $pull: {
          likes: like._id,
        },
      }
    ).exec()
  );

  const deleteAllQuoteRef = async () =>
    Promise.all([
      User.updateOne(
        { _id: quote.submittedBy },
        {
          $pull: {
            quotes: quote._id,
          },
        }
      ).exec(),
      ...updateTagsWithThisQuote,
      ...updateUsers,
      Like.deleteMany({ quote }).exec(),
    ]);

  await deleteAllQuoteRef();

  return quote;
});

const Quote = mongoose.model<QuoteInterface>("Quote", QuoteSchema);

export default Quote;
