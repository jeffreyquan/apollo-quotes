import { useMemo } from "react";
import { ApolloClient, HttpLink, split, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { DEV_ENDPOINT } from "../config";

export const NEW_QUOTE = "NEW_QUOTE";

let apolloClient;

function decodeCursor(encodedCursor: string) {
  return Buffer.from(encodedCursor, "base64").toString("ascii");
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
