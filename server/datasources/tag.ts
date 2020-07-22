import { DataSource } from "apollo-datasource";
import Tag from "../models/Tag";

class TagAPI extends DataSource {
  private context;

  initialize(config) {
    this.context = config.context;
  }

  async findTags(tags: string[]) {
    return Promise.all(tags.map((tag) => Tag.findOne({ name: tag })));
  }

  async fetchQuotesByTagName(name: string) {
    const tag = await Tag.findOne({ name }).populate("quotes").exec();
    return tag.quotes;
  }
}

export default TagAPI;
