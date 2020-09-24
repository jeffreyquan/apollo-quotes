import React, { useRef, useState, useEffect, useContext } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";
import { AuthContext } from "./Auth";
import { ErrorsType, useForm, validateInputs } from "../lib/useForm";
import { Form } from "../styles/Form";
import { FormContainer } from "../styles/FormContainer";
import { FormTitle } from "../styles/FormTitle";
import { Message } from "./Message";

const REGISTER_MUTATION = gql`
  mutation REGISTER_MUTATION(
    $name: String!
    $username: String!
    $email: String!
    $password: String!
  ) {
    register(
      name: $name
      username: $username
      email: $email
      password: $password
    ) {
      id
      name
      email
      username
    }
  }
`;

export const SignUp: React.FC = () => {
  const { inputs, handleChange } = useForm({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmationPassword: "",
  });

  const [errors, setErrors] = useState<ErrorsType>({});

  const [serverError, setServerError] = useState<boolean>(false);

  const [disabled, setDisabled] = useState<boolean>(true);

  const isMounted = useRef(false);

  const { name, username, email, password, confirmationPassword } = inputs;

  const { user } = useContext(AuthContext);

  const [loadingPage, setLoadingPage] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/quotes");
    } else {
      setLoadingPage(false);
    }
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

  const request = { ...inputs };
  delete request.confirmationPassword;

  const [register, { loading }] = useMutation(REGISTER_MUTATION, {
    variables: request,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await register();
    } catch (err) {
      const errors: ErrorsType = {};
      const { message } = err;
      if (message === "Username already exists") {
        errors.username = message;
        setErrors(errors);
      } else if (message === "Email already exists") {
        errors.email = message;
        setErrors(errors);
      } else if (err.graphQLErrors[0]?.extensions.exception.errors) {
        const inputKeys = Object.keys(
          err.graphQLErrors[0].extensions.exception.errors
        );
        inputKeys.forEach(
          (key) =>
            (errors[key] =
              err.graphQLErrors[0].extensions.exception.errors[
                key
              ].properties.message)
        );
        setErrors(errors);
      } else {
        setServerError(true);
      }
    }
  };

  return !loadingPage ? (
    <FormContainer>
      <Head>
        <title>Apollo Quotes | Sign Up</title>
      </Head>
      <Message error={serverError ? true : false}>
        {serverError && "Sign up failed. Please try again."}
      </Message>
      <Form onSubmit={handleSubmit}>
        <FormTitle>Join the Apollo Quotes community</FormTitle>
        <fieldset disabled={loading} aria-busy={loading}>
          <label htmlFor="signUpName">Name</label>
          <input
            id="signUpName"
            name="name"
            type="text"
            placeholder="John Smith"
            value={name}
            onChange={handleChange}
            onFocus={() => setServerError(false)}
            autoComplete="name"
            autoFocus
            required
          />
          <p>{errors.name && errors.name}</p>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="jsmith"
            value={username}
            onChange={handleChange}
            onFocus={() => setServerError(false)}
            autoComplete="username"
            required
          />
          <p>{errors.username && errors.username}</p>
          <label htmlFor="signUpEmail">Email</label>
          <input
            id="signUpEmail"
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            onFocus={() => setServerError(false)}
            autoComplete="email"
            required
          />
          <p>{errors.email && errors.email}</p>
          <label htmlFor="signUpPassword">Password</label>
          <input
            id="signUpPassword"
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
            onFocus={() => setServerError(false)}
            autoComplete="new-password"
            required
          />
          <p>{errors.password && errors.password}</p>
          <label htmlFor="confirmationPassword">
            Confirm Password
            <input
              id="confirmationPassword"
              name="confirmationPassword"
              type="password"
              placeholder="Confirmaton Password"
              value={confirmationPassword}
              onChange={handleChange}
              onFocus={() => setServerError(false)}
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
