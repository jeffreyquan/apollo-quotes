import { DataSource } from "apollo-datasource";
import { ApolloError } from "apollo-server";
import Tag from "../models/Tag";

class TagAPI extends DataSource {
  private context;

  initialize(config) {
    this.context = config.context;
  }

  findTags(tags: string[]) {
    return Promise.all(tags.map((tag) => Tag.findOne({ name: tag })));
  }

  async fetchQuotesByTagName(name: string) {
    const tag = await Tag.findOne({ name })
      .populate({
        path: "quotes",
        populate: [
          {
            path: "likes",
            select: "_id user",
            populate: {
              path: "user",
              select: "username",
            },
          },
          {
            path: "tags",
          },
        ],
      })
      .exec();

    if (!tag) {
      return new ApolloError("Tag does not exist", "TAG_NOT_EXISTS");
    }

    return tag.quotes;
  }
}

export default TagAPI;
