import { useRef, useState, useEffect, useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";
import { AuthContext } from "./Auth";
import { useForm } from "../lib/useForm";
import { Form } from "../styles/Form";
import { FormContainer } from "../styles/FormContainer";
import { FormTitle } from "../styles/FormTitle";

function validateInputs(inputs) {
  let errors: any = {};

  const { name, username, email, password, confirmationPassword } = inputs;

  const nameRegex = /^[A-Za-z]+((\s)?((\'|\-|\.)?([A-Za-z])+))*$/;

  if (name.length === 0) {
    errors.name = "Name cannot be empty";
  } else if (!nameRegex.test(name)) {
    errors.name = "Name is invalid";
  }

  const userNameRegex = /^[a-zA-Z][a-zA-Z0-9_]{3,15}$/;

  if (username.length === 0) {
    errors.username = "Username cannot be empty";
  } else if (!userNameRegex.test(username)) {
    errors.username =
      "Username must begin with a letter and be between 4 to 16 characters long";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email.length === 0) {
    errors.email = "Email cannot be empty";
  } else if (!emailRegex.test(email)) {
    errors.email = "Email in valid";
  }

  if (password.length === 0) {
    errors.password = "Password cannot be empty";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (confirmationPassword.length === 0) {
    errors.confirmationPassword = "Confirmation Password cannot be empty";
  } else if (password !== confirmationPassword) {
    errors.confirmationPassword =
      "Password and Confirmation Password must match";
  }

  return errors;
}

export const SignUp = () => {
  const { inputs, handleChange, resetForm } = useForm({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmationPassword: "",
  });

  const [errors, setErrors] = useState<any>({});

  const [disabled, setDisabled] = useState<boolean>(true);

  const isMounted = useRef(false);

  const { name, username, email, password, confirmationPassword } = inputs;

  let { user, setUser } = useContext(AuthContext);

  const [loadingPage, setLoadingPage] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
    setLoadingPage(false);
  }, [user]);

  useEffect(() => {
    if (isMounted.current) {
      const errors = validateInputs(inputs);
      setErrors(errors);
      if (Object.keys(errors).length === 0) {
        setDisabled(false);
      }
    } else {
      isMounted.current = true;
    }
  }, [inputs]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signing up...");
  };
  return !loadingPage ? (
    <FormContainer>
      <Head>
        <title>Apollo Quotes | Sign Up</title>
      </Head>
      <Form onSubmit={handleSubmit}>
        <FormTitle>Join the Apollo Quotes community</FormTitle>
        <fieldset>
          <label htmlFor="name">
            Name
            <input
              type="text"
              name="name"
              placeholder="John Smith"
              value={name}
              onChange={handleChange}
              autoComplete="name"
              autoFocus
              required
            />
          </label>
          <p>{errors.name && errors.name}</p>
          <label htmlFor="username">
            Username
            <input
              type="text"
              name="username"
              placeholder="jsmith"
              value={username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </label>
          <p>{errors.username && errors.username}</p>
          <label htmlFor="email">
            Email
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </label>
          <p>{errors.email && errors.email}</p>
          <label htmlFor="password">
            Password
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </label>
          <p>{errors.password && errors.password}</p>
          <label htmlFor="password">
            Confirm Password
            <input
              type="password"
              name="confirmationPassword"
              placeholder="Confirmaton Password"
              value={confirmationPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </label>
          <p>{errors.confirmationPassword && errors.confirmationPassword}</p>
          <input type="submit" value="Sign Up" disabled={disabled} />
        </fieldset>
      </Form>
    </FormContainer>
  ) : (
    <div>Loading...</div>
  );
};
