import styled from "styled-components";

export const QuoteStyles = styled.div`
  background-color: ${(props) => props.theme.cardbg2};
  color: ${(props) => props.theme.cardbody};
  padding: 2.4rem;
  border-radius: 3px;
  img {
    height: 20rem;
    width: 100%;
    object-fit: cover;
    border-radius: 3px;
  }

  p {
    font-size: 1.4rem;
  }

  p:nth-child(2) {
    text-align: right;
    font-size: 1.2rem;
  }
`;
