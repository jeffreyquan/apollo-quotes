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
    resetForm,
    clearForm,
  };
};
