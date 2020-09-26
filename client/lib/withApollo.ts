import { useMemo } from "react";
import {
  ApolloClient,
  split,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { DEV_ENDPOINT } from "../config";
import { Like as LikeType } from "../types";

export const NEW_QUOTE = "NEW_QUOTE";
export const NEW_LIKE = "NEW_LIKE";

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

function decodeCursor(encodedCursor: string) {
  return Buffer.from(encodedCursor, "base64").toString("ascii");
}

function encodeCursor(date: number) {
  return Buffer.from(date.toString()).toString("base64");
}

const isFile = (value) =>
  (typeof File !== "undefined" && value instanceof File) ||
  (typeof Blob !== "undefined" && value instanceof Blob);

const isUpload = ({ variables }) => Object.values(variables).some(isFile);

const uploadLink = new createUploadLink({
  uri: DEV_ENDPOINT, // Server URL (must be absolute)
  fetchOptions: {
    credentials: "include", // Additional fetch() options like `credentials` or `headers`,
  },
});

const wsLink = process.browser
  ? new WebSocketLink({
      // if you instantiate in the server, the error will be thrown
      uri: `ws://localhost:5000/graphql`,
      options: {
        reconnect: true,
      },
    })
  : null;

const link = process.browser
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      uploadLink
    )
  : uploadLink;

const terminalLink = split(isUpload, uploadLink, link);

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: terminalLink,
    cache: new InMemoryCache({
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
                incoming,
                { args }
              ) => {
                if (args.likedBy) {
                  if (existing.quotes.length === 0) {
                    if (incoming.totalCount === -2) {
                      return existing;
                    }

                    if (incoming.totalCount === -1) {
                      return {
                        ...incoming,
                        totalCount: 1,
                        pageInfo: {
                          endCursor: encodeCursor(incoming.pageInfo.endCursor),
                          hasMore: true,
                        },
                      };
                    }

                    return incoming;
                  }

                  if (incoming.totalCount === -2) {
                    const exists = existing.quotes.some(
                      (quote) => quote.__ref === incoming.quotes[0].__ref
                    );

                    let updatedQuotes;

                    if (exists) {
                      updatedQuotes = existing.quotes.filter(
                        (quote) => quote.__ref !== incoming.quotes[0].__ref
                      );
                    } else {
                      updatedQuotes = existing.quotes;
                    }

                    return {
                      ...existing,
                      quotes: [...updatedQuotes],
                    };
                  }

                  if (incoming.totalCount === -1) {
                    const updatedQuotes = [
                      incoming.quotes[0],
                      ...existing.quotes,
                    ];

                    return {
                      ...existing,
                      quotes: [...updatedQuotes],
                    };
                  }

                  return {
                    ...incoming,
                    quotes: [...existing.quotes, ...incoming.quotes],
                  };
                }

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
            likes: {
              keyArgs: ["id"],
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              merge(existing = [], incoming: LikeType[]) {
                return incoming;
              },
            },
          },
        },
        Quote: {
          fields: {
            likes: {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              merge(existing = [], incoming: LikeType[]) {
                return incoming;
              },
            },
          },
        },
      },
    }),
  });
}

export function initializeApollo(
  initialState: NormalizedCacheObject = null
): ApolloClient<NormalizedCacheObject> | null {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(
  initialState: NormalizedCacheObject | null
): ApolloClient<NormalizedCacheObject> | null {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
