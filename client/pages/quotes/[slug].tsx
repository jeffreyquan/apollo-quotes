import { initializeApollo } from "../../lib/withApollo";
import { ALL_QUOTES_QUERY } from "../../components/Quotes";
import SingleQuote from "../../components/SingleQuote";

export async function getStaticPaths() {
  const apolloClient = await initializeApollo();

  const res = await apolloClient.query({
    query: ALL_QUOTES_QUERY,
    variables: {
      limit: 4,
    },
  });

  const paths = res.data.quotes.quotes.map((quote) => ({
    params: {
      slug: quote.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {
  return {
    props: {
      slug,
    },
  };
}

const Quote = ({ slug }) => (
  <div>
    <SingleQuote slug={slug} />
  </div>
);

export default Quote;
