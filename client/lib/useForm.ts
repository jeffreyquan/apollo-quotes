import { useState } from "react";
interface FormState {
  [key: string]: any;
}

export const useForm = (initialState: FormState = {}) => {
  const [inputs, setInputs] = useState(initialState);

  function handleChange(e) {
    let { value, name, type } = e.target;

    if (type === "file") {
      [value] = e.target.files;
    }

    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  }

  function updateInputs(update) {
    setInputs((prevInputs) => ({
      ...prevInputs,
      ...update,
    }));
  }

  function resetForm() {
    setInputs(initialState);
  }

  function clearForm() {
    const emptyForm = Object.fromEntries(
      Object.keys(inputs).map((key) => [key, ""])
    );
    setInputs(emptyForm);
  }

  return {
    inputs,
    handleChange,
    updateInputs,
    resetForm,
    clearForm,
  };
};

export const validateInputs = (inputs) => {
  let errors: any = {};

  const { name, username, email, password, confirmationPassword } = inputs;

  const nameRegex = /^[A-Za-z]+((\s)?((\'|\-|\.)?([A-Za-z])+))*$/;

  if (!!name && name.length === 0) {
    errors.name = "Name cannot be empty";
  } else if (!nameRegex.test(name)) {
    errors.name = "Name is invalid";
  }

  const userNameRegex = /^[a-zA-Z][a-zA-Z0-9_]{3,15}$/;

  if (!!username && username.length === 0) {
    errors.username = "Username cannot be empty";
  } else if (!userNameRegex.test(username)) {
    errors.username =
      "Username must begin with a letter and be between 4 to 16 characters long";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!!email && email.length === 0) {
    errors.email = "Email cannot be empty";
  } else if (!emailRegex.test(email)) {
    errors.email = "Email is invalid";
  }

  if (!!password && password.length === 0) {
    errors.password = "Password cannot be empty";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!!confirmationPassword && confirmationPassword.length === 0) {
    errors.confirmationPassword = "Confirmation Password cannot be empty";
  } else if (!!confirmationPassword && password !== confirmationPassword) {
    errors.confirmationPassword =
      "Password and Confirmation Password must match";
  }

  return errors;
};
