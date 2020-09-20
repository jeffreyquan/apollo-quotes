import { gql, useQuery } from "@apollo/client";
import styled from "styled-components";
import { PageLoader } from "./PageLoader";
import { Quote } from "../components/Quote";

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
      }
      slug
    }
  }
`;

const SingleQuoteStyles = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  max-width: ${(props) => props.theme.maxWidth};
  margin: 0 auto;
`;

interface SingleQuoteProps {
  slug: string;
}

export const SingleQuote: React.FC<SingleQuoteProps> = ({ slug }) => {
  const { data, loading, error } = useQuery(SINGLE_QUOTE_QUERY, {
    variables: {
      slug,
    },
  });

  if (loading) return <PageLoader />;
  if (error) return <div>Error...</div>;

  const updatedQuote = { ...data.quote };
  updatedQuote.image = updatedQuote.largeImage;

  return (
    <SingleQuoteStyles>
      <Quote quote={updatedQuote} />
    </SingleQuoteStyles>
  );
};
