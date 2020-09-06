import styled from "styled-components";

export const QuoteStyles = styled.div`
  background-color: ${(props) => props.theme.cardbg};
  color: ${(props) => props.theme.cardbody};
  padding: 2.4rem;
  border-radius: 3px;
  display: ${(props) => (props.loading ? "none" : "")};
  img {
    width: 100%;
    object-fit: contain;
    border-radius: 3px;
  }

  p {
    font-size: 1.4rem;

    &:nth-child(2) {
      text-align: right;
      font-size: 1.2rem;
    }
  }
`;
