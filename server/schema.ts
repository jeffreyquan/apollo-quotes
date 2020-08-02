import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    quotes(tag: String, limit: Int, cursor: String): QuotesConnection!
    userProfile: User!
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
    register(
      name: String!
      username: String!
      password: String!
      email: String!
    ): AuthPayload!
    createQuote(
      content: String!
      author: String!
      image: String
      tags: [String]
    ): Quote
    likeQuote(quoteId: ID!): Like!
    updateQuote(
      id: ID!
      content: String
      author: String
      image: String
      tags: [String]
    ): Quote
    deleteQuote(id: ID!): Quote
  }

  type Subscription {
    newQuote: Quote
    newLike: Like
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
  }

  type Tag {
    id: ID!
    name: String!
    quotes: [Quote]!
  }

  type Like {
    id: ID!
    quote: Quote!
    user: User!
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

  type AuthPayload {
    token: String!
  }
`;
