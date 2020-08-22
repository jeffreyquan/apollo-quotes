import { useRef, useState, useEffect, useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";
import { AuthContext } from "./Auth";
import { useForm, validateInputs } from "../lib/useForm";
import { Form } from "../styles/Form";
import { FormContainer } from "../styles/FormContainer";
import { FormTitle } from "../styles/FormTitle";

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

  const request = { ...inputs };
  delete request.confirmationPassword;

  const [register, { error, loading }] = useMutation(REGISTER_MUTATION, {
    variables: request,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await register();
    } catch (err) {
      let errors: any = {};
      const { message } = err;
      if (message === "Username already exists") {
        errors.username = message;
      } else if (message === "Email already exists") {
        errors.email = message;
      } else if (!!err.graphQLErrors[0].extensions.exception.errors) {
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
      }
      setErrors(errors);
    }
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
