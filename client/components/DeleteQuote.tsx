import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";

const DELETE_QUOTE_MUTATION = gql`
  mutation DELETE_QUOTE_MUTATION($id: ID!) {
    deleteQuote(id: $id) {
      id
    }
  }
`;

export const DeleteQuote = ({ id, children }) => {
  const [deleteQuote, { error }] = useMutation(DELETE_QUOTE_MUTATION, {
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

  const router = useRouter();

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await deleteQuote();
      router.push({
        pathname: "/",
        query: { delete: "success" },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
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
