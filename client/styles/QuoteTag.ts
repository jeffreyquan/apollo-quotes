import styled from "styled-components";

const QuoteTag = styled.div`
  display: inline-block;
  font-size: 1.2rem;
  background-color: ${(props) => props.theme.cardtagbg};
  color: ${(props) => props.theme.cardtagtext};
  padding: 0.5rem 1rem;
  border-radius: 3px;
  margin-right: 0.6rem;
  margin-bottom: 0.6rem;
`;

export default QuoteTag;
