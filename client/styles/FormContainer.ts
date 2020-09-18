import styled from "styled-components";

export const FormContainer = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60rem;
  padding: 8rem 0;
  @media only screen and (max-width: ${(props) => props.theme.smallbp}) {
    width: 100vw;
  }
  align-self: flex-start;
`;
