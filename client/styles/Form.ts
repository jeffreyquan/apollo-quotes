import styled from "styled-components";

export const Form = styled.form`
  width: 100%;
  background-color: ${(props) => props.theme.formbg};
  padding: 2rem;
  border-radius: 3px;
  .link {
    display: flex;
    justify-content: center;
  }
  a {
    color: ${(props) => props.theme.formbtntext};
  }
  p {
    font-size: 1.2rem;
    color: ${(props) => props.theme.errortext};
  }
  label {
    color: ${(props) => props.theme.formheadline};

    &:not(first-child) {
      margin-top: 1rem;
    }
  }

  input,
  textarea,
  select {
    color: ${(props) => props.theme.formtext};
    background-color: ${(props) => props.theme.forminputbg};
    border: 3px solid ${(props) => props.theme.forminputbg};
    width: 100%;
    padding: 1rem;
    margin: 0.5rem 0;
    border-radius: 3px;
    outline: none;
  }
  textarea {
    resize: none;
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
    font-size: 1.4rem;
    font-weight: bold;
    background-color: ${(props) => props.theme.btnbg};
    border: none;
    color: ${(props) => props.theme.formbtntext};
    outline: none;
  }
  .input__group {
    display: flex;
    align-items: center;

    & > input {
      width: 80%;
      margin-right: 1rem;
    }

    svg {
      font-size: 2rem;
    }
  }
`;
