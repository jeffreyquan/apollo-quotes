import { useMemo } from "react";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { DEV_ENDPOINT } from "../config";

let apolloClient;

function decodeCursor(encodedCursor: string) {
  return Buffer.from(encodedCursor, "base64").toString("ascii");
}

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: createUploadLink({
      uri: DEV_ENDPOINT, // Server URL (must be absolute)
      fetchOptions: {
        credentials: "include", // Additional fetch() options like `credentials` or `headers`,
      },
    }),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            quotes: {
              keyArgs: ["tag"],
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

                if (existing.pageInfo.endCursor) {
                  existingCursor = decodeCursor(existing.pageInfo.endCursor);

                  incomingCursor = decodeCursor(incoming.pageInfo.endCursor);
                }

                if (incomingCursor > existingCursor) {
                  return existing;
                }

                const newQuotes = incoming.quotes;

                return newQuotes.length > 0
                  ? {
                      ...incoming,
                      quotes: [...existing.quotes, ...newQuotes],
                    }
                  : existing;
              },
            },
          },
        },
        Quote: {
          fields: {
            likes: {
              merge(existing = [], incoming: any) {
                return incoming;
              },
            },
          },
        },
      },
    }),
  });
}

export function initializeApollo(initialState = null) {
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

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
