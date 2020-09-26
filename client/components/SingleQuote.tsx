import { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import styled from "styled-components";
import { Quote } from "../components/Quote";
import { PageLoader } from "../components/PageLoader";
import { Quote as QuoteType } from "../types";

export const LIKES_QUERY = gql`
  query LIKES_QUERY($id: ID!) {
    likes(id: $id) {
      id
      user {
        id
        username
      }
    }
  }
`;

const LIKE_SUBSCRIPTION = gql`
  subscription NewLikeOnQuote($id: ID!) {
    newLikeOnQuote(id: $id) {
      id
      quote {
        id
        likes {
          id
          user {
            id
            username
          }
        }
      }
      user {
        id
        username
      }
      createdAt
    }
  }
`;

const SingleQuoteStyles = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  max-width: ${(props) => props.theme.maxWidth};
  margin: 0 auto;
`;

const subscribeToNewLikeOnQuote = (subscribeToMore, quoteId) => {
  if (subscribeToMore) {
    subscribeToMore({
      document: LIKE_SUBSCRIPTION,
      variables: {
        id: quoteId,
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return;
        const newLike = subscriptionData.data.newLikeOnQuote;
        const exists = prev.likes.find((like) => like.id === newLike.id);
        if (exists) {
          const updatedLikes = prev.likes.filter(
            (like) => like.id !== newLike.id
          );

          return Object.assign({}, { likes: [...updatedLikes] });
        }
        return Object.assign(
          {},
          {
            likes: [newLike, ...prev.likes],
          }
        );
      },
    });
  }
};

interface SingleQuoteProps {
  quote: QuoteType;
}

export const SingleQuote: React.FC<SingleQuoteProps> = ({ quote }) => {
  const { data, loading, error, subscribeToMore } = useQuery(LIKES_QUERY, {
    variables: {
      id: quote.id,
    },
  });

  useEffect(() => {
    if (subscribeToMore) {
      subscribeToNewLikeOnQuote(subscribeToMore, quote.id);
    }
  }, [subscribeToMore]);

  if (loading) return <PageLoader />;

  if (error) return <div>Error...</div>;

  let updatedQuote = { ...quote, image: quote.largeImage };

  if (data) {
    updatedQuote = { ...updatedQuote, likes: data.likes };
  }

  return (
    <SingleQuoteStyles>
      <Quote quote={updatedQuote} />
    </SingleQuoteStyles>
  );
};
