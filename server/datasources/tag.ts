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
}

export default TagAPI;
