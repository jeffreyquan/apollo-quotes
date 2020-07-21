import { DataSource } from "apollo-datasource";
import Quote from "../models/Quote";
import User from "../models/User";
import Tag from "../models/Tag";
import { TagInterface } from "../models/Interfaces";

class QuoteAPI extends DataSource {
  private context;

  initialize(config) {
    this.context = config.context;
  }

  async findTags(tags: string[]) {
    return Promise.all(tags.map((tag) => Tag.findOne({ name: tag })));
  }

  async createPost({ content, author, image, tags }) {
    const { user } = this.context;
    if (!user) return null;

    const fetchedUser = await User.findById(user._id).exec();

    const newQuote = await new Quote({
      content,
      author,
      image,
    });

    const data = await this.findTags(tags);

    for (let i = 0; i < data.length; i++) {
      if (!data[i]) {
        const newTag = new Tag({
          name: tags[i],
        });
        newTag.save();
        newQuote.tags.push(newTag);
      } else {
        newQuote.tags.push(data[i]);
      }
    }

    newQuote.user = user._id;
    fetchedUser.quotes.push(newQuote);

    fetchedUser.save();
    newQuote.save();

    return newQuote;
  }
}

export default QuoteAPI;
