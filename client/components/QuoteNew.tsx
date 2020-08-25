import { gql, useMutation } from "@apollo/client";
import { MdAddCircle, MdRemoveCircle } from "react-icons/md";
import { useForm } from "../lib/useForm";
import { Form } from "../styles/Form";
import { FormTitle } from "../styles/FormTitle";
import { FormContainer } from "../styles/FormContainer";
import { useRouter } from "next/router";

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
      slug
      tags {
        id
        name
      }
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

  const router = useRouter();

  // TODO: refetch all quotes after mutation
  const [createQuote, { error, loading }] = useMutation(CREATE_QUOTE_MUTATION, {
    variables: inputs,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createQuote();
      const slug = res.data.createQuote.slug;
      router.push("/quotes/[slug]", `/quotes/${slug}`);
    } catch (err) {
      // TODO: handle error
      console.log(err);
    }
  };

  const addTag = () => {
    updateInputs({
      tags: [...tags, ""],
    });
  };

  const removeTag = (index) => {
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
        <FormTitle>Submit a new quote</FormTitle>
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
              required
              onChange={handleChange}
            />
          </label>
          <label>Tags</label>
          {tags.map((tag, i) => {
            return (
              <div className="input__group" key={i}>
                <input
                  type="text"
                  name="tag"
                  value={tag}
                  onChange={(e) => handleTagChange(e, i)}
                />
                {i !== 0 && (
                  <button onClick={() => removeTag(i)}>
                    <MdRemoveCircle />
                  </button>
                )}
                {tags.length - 1 === i && (
                  <button onClick={() => addTag()}>
                    <MdAddCircle />
                  </button>
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
