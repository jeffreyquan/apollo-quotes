import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";
import styled from "styled-components";
import { BsHeart } from "react-icons/bs";
import { QuoteStyles } from "../styles/QuoteStyles";
import { QuoteTag } from "../styles/QuoteTag";
import { ALL_QUOTES_QUERY } from "./Quotes";

const QuoteBody = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-gap: 1rem;
`;

const QuoteImg = styled.div`
  grid-column: 1 / 4;
`;

const QuoteContent = styled.div`
  grid-column: 4 / 9;
`;

const QuoteFooter = styled.div`
  display: flex;
  align-items: center;
  margin-right: auto;
`;

const Like = styled.div`
  display: flex;
  align-items: center;
  svg {
    margin-left: 0.8rem;
  }
`;

const TagList = styled.div`
  display: inline-block;
  margin-right: auto;
`;

const LIKE_MUTATION = gql`
  mutation LIKE_MUTATION($quoteId: String!) {
    likeQuote(quoteId: $quoteId) {
      id
      quote {
        id
        likes {
          id
          user {
            id
            username
          }
        }
      }
      user {
        id
        username
      }
    }
  }
`;

export const Quote = ({ quote }) => {
  const { id, author, content, image, tags, likes } = quote;
  const [like] = useMutation(LIKE_MUTATION, {
    update(cache, { data: { like } }) {
      const { quotes } = cache.readQuery({
        query: ALL_QUOTES_QUERY,
      });
      const likedQuote = quotes.find((quote) => quote.id === id);

      likedQuote.likes = like.quote.likes;

      cache.writeQuery({
        query: ALL_QUOTES_QUERY,
        data: {
          quotes: [...quotes, likedQuote],
        },
      });
    },
  });
  const router = useRouter();
  const fetchQuoteWithTag = (
    e: React.MouseEvent<HTMLDivElement>,
    tagName: string
  ) => {
    e.preventDefault();
    router.push({
      pathname: "/quotes",
      query: { tag: tagName },
    });
  };

  const likeQuote = async (e) => {
    e.preventDefault();
    await like();
  };

  return (
    <QuoteStyles>
      <QuoteBody>
        <QuoteImg>
          <img src={image} alt={author} />
        </QuoteImg>
        <QuoteContent>
          <p>&#8220;{content}&#8221;</p>
          <p>&mdash; {author}</p>
        </QuoteContent>
      </QuoteBody>
      <QuoteFooter>
        <TagList>
          {tags.map((tag) => (
            <QuoteTag
              key={tag.id}
              onClick={(e) => fetchQuoteWithTag(e, tag.name)}
            >
              {tag.name}
            </QuoteTag>
          ))}
        </TagList>
        <Like>
          {likes.length} likes <BsHeart onClick={(e) => likeQuote(e)} />
        </Like>
      </QuoteFooter>
    </QuoteStyles>
  );
};
