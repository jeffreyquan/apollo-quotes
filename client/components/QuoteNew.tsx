import React from "react";
import { gql, useMutation } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { MdAddCircle } from "react-icons/md";
import { useForm } from "../lib/useForm";
import { Form } from "../styles/Form";
import { FormTitle } from "../styles/FormTitle";
import { FormContainer } from "../styles/FormContainer";
import { QuoteTag } from "../styles/QuoteTag";
import { AddIconStyles } from "../styles/AddIconStyles";
import { Message } from "./Message";

export const CREATE_QUOTE_MUTATION = gql`
  mutation CREATE_QUOTE_MUTATION(
    $content: String!
    $author: String!
    $image: Upload
    $tags: [String]
  ) {
    createQuote(
      content: $content
      author: $author
      image: $image
      tags: $tags
    ) {
      id
      author
      content
      image
      largeImage
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

export const QuoteNew: React.FC = () => {
  const { inputs, handleChange, updateInputs } = useForm({
    content: "",
    author: "",
    image: "",
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const { content, author, image, tags } = inputs;

  const router = useRouter();

  // TODO: refetch all quotes after mutation
  const [createQuote, { error, loading }] = useMutation(CREATE_QUOTE_MUTATION, {
    variables: inputs,
    update(cache, { data: { createQuote } }) {
      cache.modify({
        fields: {
          quotes(
            existing = {
              __typename: "QuotesConnection",
              totalCount: 0,
              pageInfo: {
                endCursor: null,
                hasMore: true,
              },
              quotes: [],
            },
            { readField }
          ) {
            const newQuoteRef = cache.writeFragment({
              data: createQuote,
              fragment: gql`
                fragment NewQuote on Quote {
                  id
                  author
                  content
                  image
                  largeImage
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
              `,
            });

            if (
              existing.quotes.some(
                (ref) => readField("id", ref) === createQuote.id
              )
            ) {
              return existing;
            }

            return {
              ...existing,
              quotes: [newQuoteRef, ...existing.quotes],
            };
          },
        },
      });
    },
  });

  if (error)
    setErrorMessage("Quote was unsuccessfully created. Please try again.");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createQuote();
      const slug = res.data.createQuote.slug;
      router.push("/quotes/[slug]", `/quotes/${slug}`);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const timeoutId = useRef<number>();

  useEffect(() => {
    if (errorMessage) {
      timeoutId.current = window.setTimeout(function () {
        setErrorMessage("");
      }, 3000);
    }
  }, [errorMessage]);

  const addTag = () => {
    const tagName = tagInput.toLowerCase();
    if (!tags.includes(tagName)) {
      updateInputs({
        tags: [...tags, tagName],
      });
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    updateInputs({
      tags: updatedTags,
    });
  };

  return (
    <FormContainer>
      <Message error={errorMessage ? true : false}>{errorMessage}</Message>
      <Form onSubmit={handleSubmit}>
        <FormTitle>Submit a new quote</FormTitle>
        <fieldset disabled={loading} aria-busy={loading}>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            placeholder="When nothing goes right, go left."
            rows={4}
            value={content}
            onChange={handleChange}
          />
          <label htmlFor="author">Author</label>
          <input
            id="author"
            type="text"
            name="author"
            placeholder="JR Smith"
            value={author}
            onChange={handleChange}
          />
          <label htmlFor="file">Image</label>
          <input
            type="file"
            id="file"
            name="image"
            placeholder="Upload an image"
            onChange={handleChange}
            value={image}
            required
          />
          <label htmlFor="tag">Tags</label>
          <div className="input__group">
            <input
              id="tag"
              name="tag"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="power"
            />
            <AddIconStyles data-testid="addTag" onClick={() => addTag()}>
              <MdAddCircle />
            </AddIconStyles>
          </div>
          <div>
            {tags.length > 0 &&
              tags.map((tag, i) => {
                return (
                  <QuoteTag
                    key={`${tag}-${i}`}
                    className="edit"
                    onClick={() => removeTag(i)}
                  >
                    {tag}
                  </QuoteTag>
                );
              })}
          </div>
          <input type="submit" value="Submit" />
        </fieldset>
      </Form>
    </FormContainer>
  );
};
