import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "../lib/useForm";
import { Form } from "../styles/Form";
import { FormContainer } from "../styles/FormContainer";

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
      content
      author
      image
      tags
    }
  }
`;

export const QuoteNew = () => {
  const { inputs, handleChange, updateInputs, resetForm, clearForm } = useForm({
    content: "",
    author: "",
    image: "",
    tags: [""],
  });

  const { content, author, image, tags } = inputs;

  const [createQuote, { error, loading }] = useMutation(CREATE_QUOTE_MUTATION, {
    variables: inputs,
  });

  const handleSubmit = (e) => {};

  const handleAddClick = () => {
    updateInputs({
      tags: [...tags, ""],
    });
  };

  const handleRemoveClick = (index) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    updateInputs({
      tags: updatedTags,
    });
  };

  const handleTagChange = (e, i) => {
    const { value } = e.target;
    const updatedTags = [...tags];
    updatedTags[i] = value;
    updateInputs({
      tags: updatedTags,
    });
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <fieldset disabled={loading} aria-busy={loading}>
          <label htmlFor="content">
            Content
            <textarea
              name="content"
              placeholder="When nothing goes right, go left."
              value={content}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="author">
            Author
            <input
              type="text"
              name="JR Smith"
              placeholder="Author"
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
              required
              onChange={handleChange}
            />
          </label>
          <label>Tags</label>
          {tags.map((tag, i) => {
            return (
              <div>
                <input
                  type="text"
                  name="tag"
                  value={tag}
                  onChange={(e) => handleTagChange(e, i)}
                />
                {i !== 0 && (
                  <button onClick={() => handleRemoveClick(i)}>Remove</button>
                )}
                {tags.length - 1 === i && (
                  <button onClick={() => handleAddClick()}>Add</button>
                )}
              </div>
            );
          })}

          <input type="submit" value="Submit" />
        </fieldset>
      </Form>
    </FormContainer>
  );
};
