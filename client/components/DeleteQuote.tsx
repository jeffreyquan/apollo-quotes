import React from "react";
import { gql, useMutation } from "@apollo/client";
import { BsExclamationCircle } from "react-icons/bs";
import { useRouter } from "next/router";
import { ActionLoader } from "./ActionLoader";

const DELETE_QUOTE_MUTATION = gql`
  mutation DELETE_QUOTE_MUTATION($id: ID!) {
    deleteQuote(id: $id) {
      id
    }
  }
`;

interface DeleteQuoteProps {
  id: string;
}

export const DeleteQuote: React.FC<DeleteQuoteProps> = ({ id, children }) => {
  const [deleteQuote, { error, loading }] = useMutation(DELETE_QUOTE_MUTATION, {
    variables: { id },
    update(cache, { data: { deleteQuote } }) {
      cache.modify({
        fields: {
          quotes(
            existing = {
              __typename: "QuotesConnection",
              totalCount: 0,
              pageInfo: {
                endCursor: null,
                hasMore: true,
              },
              quotes: [],
            },
            { readField }
          ) {
            const updatedQuotes = existing.quotes.filter(
              (quoteRef) => readField("id", quoteRef) !== deleteQuote.id
            );
            return {
              ...existing,
              quotes: [...updatedQuotes],
            };
          },
        },
      });
    },
  });

  if (loading) return <ActionLoader />;
  if (error) return <BsExclamationCircle />;

  const router = useRouter();

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await deleteQuote();
      router.push({
        pathname: "/quotes",
        query: { delete: "success" },
      });
    } catch (err) {
      return <BsExclamationCircle />;
    }
  };

  return (
    <div
      data-testid="deleteButton"
      onClick={(e) => {
        if (confirm("Please confirm you want to delete this quote.")) {
          handleClick(e);
        }
      }}
    >
      {children}
    </div>
  );
};
