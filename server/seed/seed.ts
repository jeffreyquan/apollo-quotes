import dotenv from "dotenv";
import User from "../models/User";
import Quote from "../models/Quote";
import Tag from "../models/Tag";
import Like from "../models/Like";
import { items } from "./items";

dotenv.config();

export const initializeSeed = async () => {
  console.log(
    "Reseting the database.\nDeleting existing users, quotes, likes and tags..."
  );

  await Promise.all([
    User.deleteMany({}).exec(),
    Quote.deleteMany({}).exec(),
    Like.deleteMany({}).exec(),
    Tag.deleteMany({}).exec(),
  ]);

  console.log("Reset completed.\nCreating new user and quotes...");

  const newUser = new User({
    name: "Jeffrey",
    username: "jeffrey",
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
    role: "ADMIN",
  });

  const user = await newUser.save();
  console.log(`New user created`);

  const createNewQuotes = async () => {
    for (const [index, item] of items.entries()) {
      const { author, content, image, largeImage, tags } = item;
      const newQuote = await createQuote({
        author,
        content,
        image,
        largeImage,
        tags,
        user,
      });

      if (newQuote) {
        console.log(`${index + 1}. Quote by ${author} created`);
      } else {
        console.log(`Error creating quote by ${author}`);
      }
    }
  };

  await createNewQuotes();
  console.log(`Seeding completed`);
};

async function createQuote({ content, author, image, largeImage, tags, user }) {
  try {
    const slug = generateSlug(author, content);

    const existingQuote = await Quote.findOne({ slug }).exec();

    if (existingQuote) return;

    const existingTags = await findTags(tags);

    const newQuote = await new Quote({
      content,
      author,
      image,
      largeImage,
    });

    newQuote.submittedBy = user._id;
    newQuote.slug = slug;

    for (let i = 0; i < existingTags.length; i++) {
      if (!existingTags[i]) {
        const newTag = new Tag({
          name: tags[i],
        });
        newTag.quotes.push(newQuote);
        await newTag.save();
        newQuote.tags.push(newTag);
      } else {
        existingTags[i].quotes.push(newQuote);
        await existingTags[i].save();
        newQuote.tags.push(existingTags[i]);
      }
    }

    user.quotes.push(newQuote);

    await Promise.all([user.save(), newQuote.save()]);

    return newQuote;
  } catch (err) {
    return err;
  }
}

function generateSlug(author: string, content: string): string {
  const authorSlug = author
    .replace(/[^a-zA-Z ]/g, "")
    .split(" ")
    .join("-")
    .toLowerCase();

  const contentSlug = content
    .replace(/[^a-zA-Z ]/g, "")
    .split(" ")
    .slice(0, 4)
    .join("-")
    .toLowerCase();

  return `${authorSlug}-${contentSlug}`;
}

function findTags(tags: string[]) {
  return Promise.all(tags.map((tag) => Tag.findOne({ name: tag })));
}