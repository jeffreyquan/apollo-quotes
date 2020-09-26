import { gql } from "apollo-server";

export const typeDefs = gql`
  scalar BigInt

  type Query {
    likes(id: ID!): [Like]
    paths: [Slug]
    quote(slug: String!): Quote
    quotes(
      tag: String
      limit: Int
      cursor: String
      submittedBy: ID
      likedBy: ID
    ): QuotesConnection!
    userProfile: User!
  }

  type Mutation {
    login(email: String!, password: String!): User!
    logout: Message
    register(
      name: String!
      username: String!
      password: String!
      email: String!
    ): User!
    createQuote(
      content: String!
      author: String!
      image: Upload
      tags: [String]
    ): Quote
    likeQuote(quoteId: ID!): Like!
    updateQuote(id: ID!, content: String, author: String, tags: [String]): Quote
    deleteQuote(id: ID!): Quote
  }

  type Subscription {
    newQuote: Quote
    newLike: Like
    newLikeOnQuote(id: ID!): Like
  }

  type Quote {
    id: ID!
    submittedBy: User!
    content: String!
    author: String!
    slug: String!
    likes: [Like]!
    image: String
    largeImage: String
    tags: [Tag]!
  }

  type User {
    id: ID!
    username: String!
    name: String!
    password: String!
    email: String!
    quotes: [Quote]!
    likes: [Quote]!
    role: Role!
  }

  enum Role {
    ADMIN
    EDITOR
    USER
  }

  type Tag {
    id: ID!
    name: String!
    quotes: [Quote]!
  }

  type Like {
    id: ID!
    quote: Quote
    user: User!
    createdAt: BigInt!
  }

  type QuotesConnection {
    totalCount: Int!
    pageInfo: PageInfo!
    quotes: [Quote]!
  }

  type PageInfo {
    endCursor: String
    hasMore: Boolean
  }

  type Message {
    message: String
  }

  type Slug {
    slug: String
  }
`;
