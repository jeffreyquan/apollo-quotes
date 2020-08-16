import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../lib/withApollo";
import { AuthProvider } from "../components/Auth";
import { Page } from "../components/Page";

const App = ({ Component, pageProps }) => {
  const client = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Page>
          <Component {...pageProps} />
        </Page>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default App;
