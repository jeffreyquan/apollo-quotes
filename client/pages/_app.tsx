import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../lib/withApollo";
import { Page } from "../components/Page";

const App = ({ Component, pageProps }) => {
  const client = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={client}>
      <Page>
        <Component {...pageProps} />
      </Page>
    </ApolloProvider>
  );
};

export default App;
