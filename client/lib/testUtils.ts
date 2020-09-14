import { InMemoryCache } from "@apollo/client";

const NEW_QUOTE = "NEW_QUOTE";

function decodeCursor(encodedCursor: string) {
  return Buffer.from(encodedCursor, "base64").toString("ascii");
}

const testQuote = {
  id: "testquote123",
  author: "Forrest Gump, Forrest Gump",
  content:
    "Life was like a box of chocolates. You never know what you're gonna get.",
  image: "https://www.fillmurray.com/200/300",
  largeImage: "https://www.fillmurray.com/200/300",
  likes: [
    {
      id: "abc",
      user: { id: "abd123", username: "John", __typename: "User" },
      __typename: "Like",
    },
    {
      id: "abd",
      user: { id: "abe123", username: "Ben", __typename: "User" },
      __typename: "Like",
    },
  ],
  tags: [
    { id: "abe", name: "movie", __typename: "Tag" },
    { id: "abf", name: "life", __typename: "Tag" },
  ],
  submittedBy: {
    id: "abce1234",
    __typename: "User",
  },
  slug: "forrest-gump",
  __typename: "Quote",
};

const testCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        quotes: {
          keyArgs: ["tag", "submittedBy", "likedBy"],
          merge: (
            existing = {
              __typename: "QuotesConnection",
              totalCount: 0,
              pageInfo: {
                endCursor: null,
                hasMore: true,
              },
              quotes: [],
            },
            incoming
          ) => {
            let existingCursor;
            let incomingCursor;

            if (
              existing.pageInfo.endCursor &&
              incoming.pageInfo.endCursor !== NEW_QUOTE
            ) {
              existingCursor = decodeCursor(existing.pageInfo.endCursor);

              incomingCursor = decodeCursor(incoming.pageInfo.endCursor);
            }

            if (incomingCursor > existingCursor) {
              return existing;
            }

            const newQuotes = incoming.quotes;

            let update;

            if (incoming.pageInfo.endCursor === NEW_QUOTE) {
              update = {
                pageInfo: existing.pageInfo,
                quotes: [...newQuotes, ...existing.quotes],
                totalCount: incoming.totalCount,
              };
            } else {
              update = {
                quotes: [...existing.quotes, ...newQuotes],
              };
            }

            return newQuotes.length > 0
              ? {
                  ...incoming,
                  ...update,
                }
              : existing;
          },
        },
      },
    },
    Quote: {
      fields: {
        likes: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

const testNewQuote = {
  id: "abcd123",
  author: "CS",
  content: "Hello World",
  image: "",
  largeImage: "",
  tags: [
    { id: "tag123", name: "power" },
    { id: "tag124", name: "life" },
  ],
  likes: [],
  slug: "hello-world-cs",
};

export { testCache, testQuote, testNewQuote };
