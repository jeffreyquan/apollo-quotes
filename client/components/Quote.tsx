import styled from "styled-components";
import { QuoteStyles } from "../styles/QuoteStyles";
import { QuoteTag } from "../styles/QuoteTag";

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
  display: inline-block;
`;

const TagList = styled.div`
  display: inline-block;
  margin-right: auto;
`;

export const Quote = ({ quote }) => {
  const { author, content, image, tags, likes } = quote;
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
            <QuoteTag key={tag.id}>{tag.name}</QuoteTag>
          ))}
        </TagList>
        <Like>{likes.length} likes</Like>
      </QuoteFooter>
    </QuoteStyles>
  );
};
