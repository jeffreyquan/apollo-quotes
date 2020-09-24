import { useEffect, useRef, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useContext } from "react";
import { MdAddCircle } from "react-icons/md";
import { useRouter } from "next/router";
import { PageLoader } from "./PageLoader";
import { AuthContext } from "./Auth";
import { Message } from "./Message";
import { useForm } from "../lib/useForm";
import { Form } from "../styles/Form";
import { FormTitle } from "../styles/FormTitle";
import { FormContainer } from "../styles/FormContainer";
import { QuoteTag } from "../styles/QuoteTag";
import { AddIconStyles } from "../styles/AddIconStyles";

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
  const { inputs, handleChange, updateInputs } = useForm({
    id: "",
    author: "",
    content: "",
    tags: [],
  });

  const { user } = useContext(AuthContext);

  const [loadingPage, setLoadingPage] = useState(true);

  const [errorMessage, setErrorMessage] = useState(null);

  const timeoutId = useRef<number>();

  useEffect(() => {
    if (errorMessage) {
      clearTimeout(timeoutId.current);
      timeoutId.current = window.setTimeout(function () {
        setErrorMessage(null);
      }, 3000);
    }

    return () => {
      clearTimeout(timeoutId.current);
    };
  }, [errorMessage]);

  const [tagInput, setTagInput] = useState("");

  const { loading, error: singleQuoteError } = useQuery(SINGLE_QUOTE_QUERY, {
    variables: {
      slug,
    },
    onCompleted: (data) => {
      if (user.id !== data.quote.submittedBy.id) {
        router.push({
          pathname: `/quotes/${data.quote.slug}`,
        });
      } else {
        const { id, author, content, tags } = data.quote;

        const tagNames = tags.map((tag) => tag.name);

        const formInputs = {
          id,
          author,
          content,
          tags: tagNames,
        };

        updateInputs(formInputs);
        setLoadingPage(false);
      }
    },
  });

  const [updateQuote, { loading: updating, error: updateError }] = useMutation(
    UPDATE_QUOTE_MUTATION,
    {
      variables: { ...inputs },
    }
  );

  const router = useRouter();

  if (singleQuoteError || updateError) return <div>Error...</div>;

  if (loading || updating) return <PageLoader />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateQuote();
      const slug = res.data.updateQuote.slug;
      router.push(`/quotes/${slug}`);
    } catch (err) {
      // TODO: handle error
      setErrorMessage(err.message);
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
    const updatedTags = [...inputs.tags];
    updatedTags.splice(index, 1);
    updateInputs({
      tags: updatedTags,
    });
  };

  const { content, author, tags } = inputs;

  return !loadingPage ? (
    <div>
      {errorMessage && <Message error>{errorMessage}</Message>}
      <FormContainer>
        <Form onSubmit={handleSubmit}>
          <FormTitle>Edit quote</FormTitle>
          <fieldset>
            <label htmlFor="updateContent">Content</label>
            <textarea
              id="updateContent"
              name="content"
              placeholder="When nothing goes right, go left."
              rows={4}
              value={content}
              onChange={handleChange}
            />
            <label htmlFor="updateAuthor">Author</label>
            <input
              id="updateAuthor"
              type="text"
              name="author"
              placeholder="JR Smith"
              value={author}
              onChange={handleChange}
            />
            <label>Tags</label>
            <div className="input__group">
              <input
                id="updateTag"
                type="text"
                name="tagInput"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
              />
              <AddIconStyles
                data-testid="updateTags"
                type="button"
                onClick={() => addTag()}
              >
                <MdAddCircle />
              </AddIconStyles>
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
    </div>
  ) : (
    <div>
      <PageLoader />
    </div>
  );
};
