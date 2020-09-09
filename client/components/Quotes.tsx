import React, { useContext, useEffect, useRef, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import styled from "styled-components";
import { Waypoint } from "react-waypoint";
import { Quote } from "../components/Quote";
import { AuthContext } from "./Auth";
import { Message } from "./Message";
import { NEW_QUOTE } from "../lib/withApollo";

export const ALL_QUOTES_QUERY = gql`
  query ALL_QUOTES_QUERY(
    $tag: String
    $limit: Int
    $cursor: String
    $submittedBy: ID
    $likedBy: ID
  ) {
    quotes(
      tag: $tag
      limit: $limit
      cursor: $cursor
      submittedBy: $submittedBy
      likedBy: $likedBy
    ) {
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
        submittedBy {
          id
        }
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

const QUOTES_SUBSCRIPTION = gql`
  subscription NewQuote {
    newQuote {
      id
      author
      content
      image
      largeImage
      submittedBy {
        id
      }
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
`;

const subscribeToNewQuotes = (subscribeToMore) => {
  subscribeToMore({
    document: QUOTES_SUBSCRIPTION,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return;
      const newQuote = subscriptionData.data.newQuote;
      const exists = prev.quotes.quotes.find(({ id }) => id === newQuote.id);
      if (exists) return;

      return Object.assign(
        {},
        {
          quotes: {
            pageInfo: {
              ...prev.quotes.pageInfo,
              endCursor: NEW_QUOTE,
            },
            quotes: [newQuote],
            totalCount: prev.quotes.totalCount + 1,
            __typename: prev.quotes.__typename,
          },
        }
      );
    },
  });
};

const QuotesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30rem, 100rem));
  grid-gap: 2.4rem;
  justify-content: center;
  max-width: ${(props) => props.theme.maxWidth};
  margin: 0 auto;
  @media only screen and (max-width: ${(props) => props.theme.smallbp}) {
    overflow-y: auto;
    padding-bottom: 9rem;
  }
`;
interface QuotesProps {
  tag?: string;
  limit?: number;
  cursor?: string;
  submittedBy?: string;
  likedBy?: string;
}

export const Quotes: React.FC<QuotesProps> = ({
  tag,
  limit,
  cursor,
  submittedBy,
  likedBy,
}) => {
  const [prevCursor, setPrevCursor] = useState(null);
  const [showMessage, setShowMessage] = useState(false);

  const { data, loading, error, fetchMore, subscribeToMore } = useQuery(
    ALL_QUOTES_QUERY,
    {
      variables: { tag, limit, cursor, submittedBy, likedBy },
    }
  );

  useEffect(() => {
    subscribeToNewQuotes(subscribeToMore);
  }, [subscribeToMore]);

  const router = useRouter();

  let { user } = useContext(AuthContext);

  if (submittedBy) {
    if (submittedBy !== user.id) {
      router.push("/quotes");
    }
  }

  if (likedBy) {
    if (likedBy !== user.id) {
      router.push("/quotes");
    }
  }

  const timeoutId = useRef<number>();

  useEffect(() => {
    if (router.query.delete === "success") {
      setShowMessage(true);
    }

    return () => {
      clearTimeout(timeoutId.current);
    };
  }, [router.query]);

  useEffect(() => {
    if (showMessage) {
      timeoutId.current = window.setTimeout(function () {
        setShowMessage(false);
        router.push("/");
      }, 3000);
    }
  }, [showMessage]);

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
    hasMore = data.quotes.pageInfo.hasMore;
  }

  return (
    <QuotesList>
      <Message>{showMessage ? "Successfully deleted quote" : null}</Message>
      {quotes &&
        quotes.map((quote, index) => (
          <React.Fragment key={quote.id}>
            <Link href="/quotes/[...slug]" as={`/quotes/${quote.slug}`}>
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
