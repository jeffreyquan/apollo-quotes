import { InMemoryCache } from "@apollo/client";

const NEW_QUOTE = "NEW_QUOTE";

function decodeCursor(encodedCursor: string) {
  return Buffer.from(encodedCursor, "base64").toString("ascii");
}

type FakeQuote = {
  id: string;
  author: string;
  content: string;
  image?: string;
  largeImage?: string;
  likes: FakeLike[];
  tags: FakeTag[];
  submittedBy?: FakeUser;
  slug?: string;
  __typename?: string;
};

type FakeLike = {
  id: string;
  user: FakeUser;
  __typename?: string;
};

type FakeUser = {
  id: string;
  username?: string;
  name?: string;
  __typename?: string;
};

type FakeTag = {
  id: string;
  name: string;
  __typename?: string;
};

const fakeQuoteWithoutUserLike = (): FakeQuote => ({
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
    id: "abc123",
    __typename: "User",
  },
  slug: "forrest-gump",
  __typename: "Quote",
});

const fakeQuoteWithUserLike = (): FakeQuote => ({
  id: "testquote124",
  author: "Forrest Gump, Forrest Gump",
  content:
    "Life was like a box of chocolates. You never know what you're gonna get.",
  image: "https://www.fillmurray.com/200/300",
  largeImage: "https://www.fillmurray.com/200/300",
  likes: [
    {
      id: "abd",
      user: { id: "abc123", username: "jeffrey", __typename: "User" },
      __typename: "Like",
    },
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
});

const fakeCache = (): InMemoryCache =>
  new InMemoryCache({
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  });

const fakeNewQuote = (): FakeQuote => ({
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
});

export {
  fakeCache,
  fakeQuoteWithoutUserLike,
  fakeQuoteWithUserLike,
  fakeNewQuote,
};
