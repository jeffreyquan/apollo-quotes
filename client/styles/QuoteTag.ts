import styled from "styled-components";

export const QuoteTag = styled.div`
  display: inline-block;
  font-size: 1.2rem;
  background-color: ${(props) => props.theme.cardtagbg};
  color: ${(props) => props.theme.cardtagtext};
  border: 1px solid ${(props) => props.theme.cardtagbg};
  padding: 0.5rem 1rem;
  border-radius: 3px;
  margin-right: 0.6rem;
  margin-bottom: 0.6rem;
  cursor: pointer;

  &:hover {
    background: ${(props) => props.theme.bg2};
    color: ${(props) => props.theme.headline2};
    border: 1px solid ${(props) => props.theme.cardtagbg};
  }
`;
