import React from "react";
import { gql, useQuery } from "@apollo/client";
import styled from "styled-components";
import Quote from "../components/Quote";

const ALL_QUOTES_QUERY = gql`
  query ALL_QUOTES_QUERY($tag: String, $limit: Int, $cursor: String) {
    quotes(tag: $tag, limit: $limit, cursor: $cursor) {
      totalCount
      pageInfo {
        endCursor
        hasMore
      }
      quotes {
        id
        author
        content
        image
        largeImage
        tags {
          id
          name
        }
        likes {
          user {
            username
          }
        }
        slug
      }
    }
  }
`;

const QuotesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40rem, 1fr));
  grid-gap: 2.4rem;
  max-width: ${(props) => props.theme.maxWidth};
  margin: 0 auto;
`;

interface QuotesProps {
  tag?: string;
  limit?: number;
  cursor?: string;
}

const Quotes: React.FC<QuotesProps> = ({ tag, limit, cursor }) => {
  const { data, loading, error, fetchMore, networkStatus } = useQuery(
    ALL_QUOTES_QUERY,
    {
      variables: { tag, limit, cursor },
      notifyOnNetworkStatusChange: true,
    }
  );

  const loadMore = async () => {
    fetchMore({
      variables: {
        cursor: data.quotes.pageInfo.endCursor,
        limit,
      },
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;

  const { quotes } = data.quotes;

  const { hasMore } = data.quotes.pageInfo;

  return (
    <QuotesList>
      {quotes.map((quote) => (
        <Quote quote={quote} key={quote.id} />
      ))}
      {hasMore && <button onClick={() => loadMore()}>Load more</button>}
    </QuotesList>
  );
};

export default Quotes;
