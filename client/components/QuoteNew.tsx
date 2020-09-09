import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { useRouter } from "next/router";
import { MdAddCircle } from "react-icons/md";
import { useForm } from "../lib/useForm";
import { Form } from "../styles/Form";
import { FormTitle } from "../styles/FormTitle";
import { FormContainer } from "../styles/FormContainer";
import { QuoteTag } from "../styles/QuoteTag";
import { AddIconStyles } from "../styles/AddIconStyles";

const CREATE_QUOTE_MUTATION = gql`
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

export const QuoteNew = () => {
  const { inputs, handleChange, updateInputs, resetForm, clearForm } = useForm({
    content: "",
    author: "",
    image: "",
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createQuote();
      const slug = res.data.createQuote.slug;
      router.push("/quotes/[slug]", `/quotes/${slug}`);
    } catch (err) {
      // TODO: handle error
      console.log(err.message);
    }
  };

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
      <Form onSubmit={handleSubmit}>
        <FormTitle>Submit a new quote</FormTitle>
        <fieldset disabled={loading} aria-busy={loading}>
          <label htmlFor="content">
            Content
            <textarea
              name="content"
              placeholder="When nothing goes right, go left."
              rows={4}
              value={content}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="author">
            Author
            <input
              type="text"
              name="author"
              placeholder="JR Smith"
              value={author}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="file">
            Image
            <input
              type="file"
              id="file"
              name="image"
              placeholder="Upload an image"
              onChange={handleChange}
              required
            />
          </label>
          <label>Tags</label>
          <div className="input__group">
            <input
              type="text"
              name="tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />
            <AddIconStyles onClick={() => addTag()}>
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
