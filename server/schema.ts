import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    feed: Feed!
  }

  type Feed {
    quotes: [Quote]!
  }

  type Mutation {
    post(
      content: String!
      author: String!
      image: String
      tags: [String]
    ): Quote
    login(email: String!, password: String!): AuthPayload!
    register(
      name: String!
      username: String!
      password: String!
      email: String!
    ): AuthPayload!
    like(quoteId: ID!): Quote!
  }

  type Subscription {
    newQuote: Quote
    newLike: Like
  }

  type Quote {
    id: ID!
    user: User!
    content: String!
    author: String!
    likes: [Like]!
    image: String
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
  }

  type Like {
    id: ID!
    quote: Quote!
    user: User!
  }

  type AuthPayload {
    token: String!
  }
`;
