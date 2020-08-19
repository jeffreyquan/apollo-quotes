import { useMemo } from "react";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { DEV_ENDPOINT } from "../config";

let apolloClient;

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: new HttpLink({
      uri: DEV_ENDPOINT, // Server URL (must be absolute)
      credentials: "include", // Additional fetch() options like `credentials` or `headers`,
    }),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            quotes: {
              keyArgs: ["tag"],
              merge: (
                existing = { __typename: "QuotesConnection", quotes: [] },
                incoming
              ) => {
                const result = {
                  ...incoming,
                  quotes: [...existing.quotes, ...incoming.quotes],
                };
                return result;
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
