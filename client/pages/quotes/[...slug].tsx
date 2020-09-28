import { NextPage } from "next";
import { useRouter } from "next/router";
import { GetStaticProps, GetStaticPaths } from "next";
import { gql } from "@apollo/client";
import { SingleQuote } from "../../components/SingleQuote";
import { UpdateQuote } from "../../components/UpdateQuote";
import { initializeApollo } from "../../lib/withApollo";
import { PageLoader } from "../../components/PageLoader";
import { Quote as QuoteType } from "../../types";

const PATHS_QUERY = gql`
  query PATHS_QUERY {
    paths {
      slug
    }
  }
`;

export const SINGLE_QUOTE_QUERY = gql`
  query SINGLE_QUOTE_QUERY($slug: String!) {
    quote(slug: $slug) {
      id
      author
      content
      image
      largeImage
      submittedBy {
        id
      }
      tags {
        id
        name
      }
      likes {
        id
        user {
          id
          username
        }
        createdAt
      }
      slug
    }
  }
`;

export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = await initializeApollo();

  const res = await apolloClient.query({
    query: PATHS_QUERY,
  });

  const paths = res.data.paths.map((path) => ({
    params: { slug: [path.slug] },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params: { slug } }) => {
  const apolloClient = await initializeApollo();

  const res = await apolloClient.query({
    query: SINGLE_QUOTE_QUERY,
    variables: {
      slug: slug[0],
    },
  });

  const quote = res.data.quote;

  return {
    props: {
      quote,
    },
  };
};

type SingleQuotePageProps = {
  quote: QuoteType;
};

const SingleQuotePage: NextPage<SingleQuotePageProps> = ({ quote }) => {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div>
        <PageLoader />
      </div>
    );
  }

  const { slug } = router.query;

  return (
    <div>
      {slug[1] && slug[1] === "edit" ? (
        <UpdateQuote slug={slug[0] as string} />
      ) : (
        <SingleQuote quote={quote} />
      )}
    </div>
  );
};

export default SingleQuotePage;
