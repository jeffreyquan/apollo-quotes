import styled from "styled-components";

export const Form = styled.form`
  width: 100%;
  background-color: ${(props) => props.theme.formbg};
  padding: 2rem;
  border-radius: 3px;
  label {
    color: ${(props) => props.theme.formheadline};
  }

  input,
  textarea,
  select {
    background-color: ${(props) => props.theme.forminput};
    border: 3px solid ${(props) => props.theme.forminput};
    width: 100%;
    padding: 1rem;
    margin: 0.4rem 0;
    border-radius: 3px;
    outline: none;
  }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  textarea:-webkit-autofill:active {
    transition: background-color 5000s ease-in-out 0s;
  }
  fieldset {
    border: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }
  button,
  input[type="submit"] {
    cursor: pointer;
    background-color: inherit;
    border: none;
    color: ${(props) => props.theme.formbtntext};
  }
`;