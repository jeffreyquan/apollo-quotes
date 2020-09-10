import { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";
import styled from "styled-components";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { FiDelete, FiEdit } from "react-icons/fi";
import { QuoteStyles } from "../styles/QuoteStyles";
import { QuoteTag } from "../styles/QuoteTag";
import { Quote as QuoteType } from "../types";
import { AuthContext } from "./Auth";
import { DeleteQuote } from "./DeleteQuote";

export const QuoteBody = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-gap: 1rem;
`;

export const QuoteImg = styled.div`
  grid-column: 1 / 4;
`;

export const QuoteContent = styled.div`
  grid-column: 4 / 9;
`;

export const QuoteFooter = styled.div`
  display: flex;
  align-items: center;
  margin-right: auto;
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;

  & > div {
    display: flex;
    align-items: center;
    font-size: 1.8rem;
    svg {
      margin-left: 1.2rem;
    }
  }
`;

const TagList = styled.div`
  display: inline-block;
  margin-right: auto;
`;

export const LIKE_MUTATION = gql`
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
  const { id, author, content, image, tags, likes, submittedBy, slug } = quote;

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

  const EditLink = ({ children, href, as, ...props }) => (
    <Link href={href} as={as}>
      <div {...props}>{children}</div>
    </Link>
  );

  return (
    <QuoteStyles loading={loading ? "true" : undefined}>
      <QuoteBody>
        {image && (
          <QuoteImg>
            <img src={image} alt={author} onLoad={() => setLoading(false)} />
          </QuoteImg>
        )}
        <QuoteContent>
          <p>
            &#8220;<span>{content}</span>&#8221;
          </p>
          <p>
            &mdash; <span>{author}</span>
          </p>
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
            <span>{likes.length > 0 && likes.length}</span>
            {liked ? (
              <BsHeartFill data-test="like-btn" onClick={(e) => likeQuote(e)} />
            ) : (
              <BsHeart data-test="like-btn" onClick={(e) => likeQuote(e)} />
            )}
          </div>
          {submitted && (
            <>
              <EditLink href="/quotes/[...slug]" as={`/quotes/${slug}/edit`}>
                <FiEdit />
              </EditLink>

              <DeleteQuote id={id}>
                <FiDelete />
              </DeleteQuote>
            </>
          )}
        </Controls>
      </QuoteFooter>
    </QuoteStyles>
  );
};
