import React from "react";
import { gql, useQuery } from "@apollo/client";
import styled from "styled-components";
import Quote from "../components/Quote";

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

const QuotesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(3rem, 1fr));
  grid-gap: 2.4rem;
  max-width: ${(props) => props.theme.maxWidth};
  margin: 0 auto;
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
  return (
    <QuotesList>
      {data.quotes.map((quote) => (
        <Quote quote={quote} key={quote.id} />
      ))}
    </QuotesList>
  );
};

export default Quotes;
