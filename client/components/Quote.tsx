import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";
import styled from "styled-components";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { FiDelete } from "react-icons/fi";
import { QuoteStyles } from "../styles/QuoteStyles";
import { QuoteTag } from "../styles/QuoteTag";
import { Quote as QuoteType } from "../types";
import { AuthContext } from "./Auth";
import { DeleteQuote } from "./DeleteQuote";

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

const Controls = styled.div`
  display: flex;
  align-items: center;

  & > div {
    display: flex;
    align-items: center;
    font-size: 1.6rem;
    svg {
      margin-left: 0.8rem;
    }
  }
`;

const TagList = styled.div`
  display: inline-block;
  margin-right: auto;
`;

const LIKE_MUTATION = gql`
  mutation LIKE_MUTATION($quoteId: ID!) {
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
  const { id, author, content, image, tags, likes, submittedBy } = quote;

  const [like] = useMutation(LIKE_MUTATION, {
    variables: {
      quoteId: id,
    },
    update(cache, { data: { likeQuote } }) {
      const likedQuote: QuoteType = cache.readFragment({
        id: `Quote:${id}`,
        fragment: gql`
          fragment Like on Quote {
            likes {
              id
            }
          }
        `,
      });
      const updatedLikes = likedQuote.likes;
      const foundLike = updatedLikes.some((like) => like.id === likeQuote.id);
      if (!foundLike) {
        cache.evict({
          id: `Like:${likeQuote.id}`,
        });
      }
    },
  });

  const [loading, setLoading] = useState(true);

  let { user } = useContext(AuthContext);

  let liked;

  if (user && likes) {
    liked = likes.some((like) => like.user.id === user.id);
  }

  let submitted;

  if (user) {
    submitted = submittedBy.id === user.id ? true : false;
  }

  const router = useRouter();
  console.log(router);
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
    try {
      await like();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <QuoteStyles loading={loading ? "true" : undefined}>
      <QuoteBody>
        <QuoteImg>
          <img src={image} alt={author} onLoad={() => setLoading(false)} />
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
        <Controls>
          <div>
            {likes.length > 0 && likes.length}{" "}
            {liked ? (
              <BsHeartFill onClick={(e) => likeQuote(e)} />
            ) : (
              <BsHeart onClick={(e) => likeQuote(e)} />
            )}
          </div>
          {submitted && (
            <DeleteQuote id={id}>
              <FiDelete />
            </DeleteQuote>
          )}
        </Controls>
      </QuoteFooter>
    </QuoteStyles>
  );
};
