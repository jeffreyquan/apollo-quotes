import { FileUpload } from "graphql-upload";

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: FileUpload;
};

export type Query = {
  __typename?: "Query";
  likes?: Maybe<Array<Maybe<Like>>>;
  paths?: Maybe<Array<Maybe<Slug>>>;
  quote?: Maybe<Quote>;
  quotes: QuotesConnection;
  userProfile: User;
};

export type QueryLikesArgs = {
  id: Scalars["ID"];
};

export type QueryQuoteArgs = {
  slug: Scalars["String"];
};

export type QueryQuotesArgs = {
  tag?: Maybe<Scalars["String"]>;
  limit?: Maybe<Scalars["Int"]>;
  cursor?: Maybe<Scalars["String"]>;
  submittedBy?: Maybe<Scalars["ID"]>;
  likedBy?: Maybe<Scalars["ID"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  login: User;
  logout?: Maybe<Message>;
  register: User;
  createQuote?: Maybe<Quote>;
  likeQuote: Like;
  updateQuote?: Maybe<Quote>;
  deleteQuote?: Maybe<Quote>;
};

export type MutationLoginArgs = {
  email: Scalars["String"];
  password: Scalars["String"];
};

export type MutationRegisterArgs = {
  name: Scalars["String"];
  username: Scalars["String"];
  password: Scalars["String"];
  email: Scalars["String"];
};

export type MutationCreateQuoteArgs = {
  content: Scalars["String"];
  author: Scalars["String"];
  image?: Maybe<Scalars["Upload"]>;
  tags?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type MutationLikeQuoteArgs = {
  quoteId: Scalars["ID"];
};

export type MutationUpdateQuoteArgs = {
  id: Scalars["ID"];
  content?: Maybe<Scalars["String"]>;
  author?: Maybe<Scalars["String"]>;
  tags?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type MutationDeleteQuoteArgs = {
  id: Scalars["ID"];
};

export type Subscription = {
  __typename?: "Subscription";
  newQuote?: Maybe<Quote>;
  newLike?: Maybe<Like>;
  newLikeOnQuote?: Maybe<Like>;
};

export type SubscriptionNewLikeOnQuoteArgs = {
  id: Scalars["ID"];
};

export type Quote = {
  __typename?: "Quote";
  id: Scalars["ID"];
  submittedBy: User;
  content: Scalars["String"];
  author: Scalars["String"];
  slug: Scalars["String"];
  likes: Array<Maybe<Like>>;
  image?: Maybe<Scalars["String"]>;
  largeImage?: Maybe<Scalars["String"]>;
  tags: Array<Maybe<Tag>>;
};

export type User = {
  __typename?: "User";
  id: Scalars["ID"];
  username: Scalars["String"];
  name: Scalars["String"];
  password: Scalars["String"];
  email: Scalars["String"];
  quotes: Array<Maybe<Quote>>;
  likes: Array<Maybe<Quote>>;
  role: Role;
};

export enum Role {
  Admin = "ADMIN",
  Editor = "EDITOR",
  User = "USER",
}

export type Tag = {
  __typename?: "Tag";
  id: Scalars["ID"];
  name: Scalars["String"];
  quotes: Array<Maybe<Quote>>;
};

export type Like = {
  __typename?: "Like";
  id: Scalars["ID"];
  quote?: Maybe<Quote>;
  user: User;
};

export type QuotesConnection = {
  __typename?: "QuotesConnection";
  totalCount: Scalars["Int"];
  pageInfo: PageInfo;
  quotes: Array<Maybe<Quote>>;
};

export type PageInfo = {
  __typename?: "PageInfo";
  endCursor?: Maybe<Scalars["String"]>;
  hasMore?: Maybe<Scalars["Boolean"]>;
};

export type Message = {
  __typename?: "Message";
  message?: Maybe<Scalars["String"]>;
};

export type Slug = {
  __typename?: "Slug";
  slug?: Maybe<Scalars["String"]>;
};

export enum CacheControlScope {
  Public = "PUBLIC",
  Private = "PRIVATE",
}
