import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import styled from "styled-components";
import { Waypoint } from "react-waypoint";
import { Quote } from "../components/Quote";
import { QuotesConnection } from "../types";

export const ALL_QUOTES_QUERY = gql`
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
          id
          user {
            id
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
  grid-template-columns: repeat(auto-fill, minmax(30rem, 100rem));
  grid-gap: 2.4rem;
  justify-content: center;
  max-width: ${(props) => props.theme.maxWidth};
  margin: 0 auto;
`;

interface QuotesProps {
  tag?: string;
  limit?: number;
  cursor?: string;
}

export const Quotes: React.FC<QuotesProps> = ({ tag, limit, cursor }) => {
  const [prevCursor, setPrevCursor] = useState(null);
  const { data, loading, error, fetchMore } = useQuery(ALL_QUOTES_QUERY, {
    variables: { tag, limit, cursor },
  });

  const loadMore = async () => {
    const { endCursor } = data.quotes.pageInfo;

    if (endCursor == prevCursor) {
      return;
    }

    setPrevCursor(endCursor);

    fetchMore({
      variables: {
        cursor: endCursor,
        limit,
        tag,
      },
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;

  let quotes;
  let hasMore;

  if (data) {
    quotes = data.quotes.quotes;
    console.log(quotes);
    hasMore = data.quotes.pageInfo.hasMore;
  }

  return (
    <QuotesList>
      {quotes &&
        quotes.map((quote, index) => (
          <React.Fragment key={quote.id}>
            <Link href="/quotes/[slug]" as={`/quotes/${quote.slug}`}>
              <a>
                <Quote quote={quote} />
              </a>
            </Link>
            {hasMore && index === quotes.length - 2 && (
              <Waypoint
                onEnter={() => {
                  loadMore();
                }}
              />
            )}
          </React.Fragment>
        ))}
    </QuotesList>
  );
};
