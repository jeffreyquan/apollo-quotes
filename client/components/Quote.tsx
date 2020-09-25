import React, { useEffect, useRef } from "react";
import { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";
import styled from "styled-components";
import { BsExclamationCircle, BsHeart, BsHeartFill } from "react-icons/bs";
import { FiDelete, FiEdit } from "react-icons/fi";
import { QuoteStyles } from "../styles/QuoteStyles";
import { QuoteTag } from "../styles/QuoteTag";
import { Quote as QuoteType } from "../types";
import { AuthContext } from "./Auth";
import { DeleteQuote } from "./DeleteQuote";
import { ALL_QUOTES_QUERY } from "./Quotes";

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

interface QuoteProps {
  quote: QuoteType;
}

export const Quote: React.FC<QuoteProps> = ({ quote }) => {
  const { id, author, content, image, tags, likes, submittedBy, slug } = quote;

  const { user } = useContext(AuthContext);

  const [like] = useMutation(LIKE_MUTATION, {
    variables: {
      quoteId: id,
    },
    refetchQueries: [
      {
        query: ALL_QUOTES_QUERY,
        variables: {
          likedBy: user.id,
        },
      },
    ],
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

  const [loading, setLoading] = useState<boolean>(true);

  const [likeError, setLikeError] = useState<boolean>(false);

  const timeoutId = useRef<number>();

  useEffect(() => {
    if (likeError) {
      timeoutId.current = window.setTimeout(function () {
        setLikeError(false);
      }, 3000);
    }

    return () => {
      clearTimeout(timeoutId.current);
    };
  }, [likeError]);

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
    } catch (err) {
      setLikeError(true);
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
            &#8220;<span data-testid="quoteContent">{content}</span>&#8221;
          </p>
          <p>
            &mdash; <span data-testid="quoteAuthor">{author}</span>
          </p>
        </QuoteContent>
      </QuoteBody>
      <QuoteFooter>
        <TagList>
          {tags.map((tag) => (
            <QuoteTag
              key={tag.id}
              onClick={(e) => fetchQuoteWithTag(e, tag.name)}
              data-testid="quoteTag"
            >
              {tag.name}
            </QuoteTag>
          ))}
        </TagList>
        <Controls>
          <div>
            <span data-testid="likeCount">
              {likes.length > 0 && likes.length}
            </span>
            {likeError && <BsExclamationCircle />}
            {liked && !likeError ? (
              <BsHeartFill
                data-testid="unlikeButton"
                onClick={(e) => likeQuote(e)}
              />
            ) : (
              !likeError && (
                <BsHeart
                  data-testid="likeButton"
                  onClick={(e) => likeQuote(e)}
                />
              )
            )}
          </div>
          {submitted && (
            <>
              <EditLink
                data-testid="editButton"
                href="/quotes/[...slug]"
                as={`/quotes/${slug}/edit`}
              >
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
