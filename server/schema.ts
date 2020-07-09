const { gql } = require("apollo-server");

export const typeDefs = gql`
  type Quote {
    id: ID!
    content: String!
    author: String!
    likes: [Like!]!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    quotes: [Quote]!
    likes: [Quote]!
  }

  type Like {
    id: ID!
    quote: Quote!
    user: User!
  }
`;
