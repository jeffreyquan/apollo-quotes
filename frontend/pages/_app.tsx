import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../lib/withApollo";
import Page from "../components/Page";

export default function App({ Component, pageProps }) {
  const client = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={client}>
      <Page>
        <Component {...pageProps} />
      </Page>
    </ApolloProvider>
  );
}
