import React from "react";
import { gql, useQuery } from "@apollo/client";

const ALL_QUOTES_QUERY = gql`
  query ALL_QUOTES_QUERY($tag: String) {
    quotes(tag: $tag) {
      id
      content
      author
      slug
    }
  }
`;

interface QuotesProps {
  tag?: string;
}

const Quotes: React.FC<QuotesProps> = ({ tag }) => {
  const { data, loading, error } = useQuery(ALL_QUOTES_QUERY, {
    variables: { tag },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;

  if (data) console.log(data);
  return <div>Hello World!</div>;
};

export default Quotes;
