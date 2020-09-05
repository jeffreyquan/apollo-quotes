import { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { MdAddCircle } from "react-icons/md";
import { useRouter } from "next/router";
import { useForm } from "../lib/useForm";
import { Form } from "../styles/Form";
import { FormTitle } from "../styles/FormTitle";
import { FormContainer } from "../styles/FormContainer";
import { QuoteTag } from "../styles/QuoteTag";

const SINGLE_QUOTE_QUERY = gql`
  query SINGLE_QUOTE_QUERY($slug: String!) {
    quote(slug: $slug) {
      id
      author
      content
      submittedBy {
        id
      }
      tags {
        name
      }
      slug
    }
  }
`;

const UPDATE_QUOTE_MUTATION = gql`
  mutation UPDATE_QUOTE_MUTATION(
    $id: ID!
    $content: String
    $author: String
    $tags: [String]
  ) {
    updateQuote(id: $id, content: $content, author: $author, tags: $tags) {
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
        user {
          username
        }
      }
      slug
    }
  }
`;

interface UpdateQuoteProps {
  slug: string;
}

export const UpdateQuote: React.FC<UpdateQuoteProps> = ({ slug }) => {
  const { inputs, handleChange, updateInputs, resetForm, clearForm } = useForm({
    id: "",
    author: "",
    content: "",
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");

  const { data, loading, error: singleQuoteError } = useQuery(
    SINGLE_QUOTE_QUERY,
    {
      variables: {
        slug,
      },
      onCompleted: (data) => {
        const { id, author, content, tags } = data.quote;

        const tagNames = tags.map((tag) => tag.name);

        const formInputs = {
          id,
          author,
          content,
          tags: tagNames,
        };

        updateInputs(formInputs);
      },
    }
  );

  const [updateQuote, { loading: updating, error: updateError }] = useMutation(
    UPDATE_QUOTE_MUTATION,
    {
      variables: { ...inputs },
    }
  );

  const router = useRouter();

  if (singleQuoteError) return <div>Error...</div>;

  if (loading) return <div>Loading...</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateQuote();
      const slug = res.data.updateQuote.slug;
      router.push("/quotes/[...slug]", `/quotes/${slug}`);
    } catch (err) {
      // TODO: handle error
      console.log(err.message);
    }
  };

  const addTag = () => {
    if (!tags.includes(tagInput)) {
      updateInputs({
        tags: [...tags, tagInput],
      });
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    const updatedTags = [...inputs.tags];
    updatedTags.splice(index, 1);
    updateInputs({
      tags: updatedTags,
    });
  };

  const { content, author, tags } = inputs;

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <FormTitle>Edit quote</FormTitle>
        <fieldset>
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
          <label>Tags</label>
          <div className="input__group">
            <input
              type="text"
              name="tagInput"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />
            <button type="button" onClick={() => addTag()}>
              <MdAddCircle />
            </button>
          </div>
          <div>
            {tags.map((tag, i) => {
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

          <input type="submit" value="Update" />
        </fieldset>
      </Form>
    </FormContainer>
  );
};
