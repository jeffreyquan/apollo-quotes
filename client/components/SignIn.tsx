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

const LOGIN_MUTATION = gql`
  mutation LOGIN_MUTATION($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      name
      email
      username
    }
  }
`;

export const SignIn = () => {
  const { inputs, handleChange, resetForm } = useForm({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<any>({});

  const isMounted = useRef(false);

  const { email, password } = inputs;

  const [loadingPage, setLoadingPage] = useState(true);

  const [disabled, setDisabled] = useState(true);

  let { user, setUser } = useContext(AuthContext);

  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (router.query.redirect) {
        router.back();
      } else {
        router.push("/");
      }
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
  console.log(disabled);

  const [login, { error, loading }] = useMutation(LOGIN_MUTATION, {
    variables: inputs,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login();
      setUser(res.data.login);
    } catch (err) {
      const { message } = err;
      if (message === "User does not exist") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: message,
        }));
      } else if (message === "Password is incorrect") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: message,
        }));
      }
    }
  };

  return !loadingPage ? (
    <FormContainer>
      <Head>
        <title>Apollo Quotes | Sign In</title>
      </Head>
      <Form onSubmit={handleSubmit}>
        <FormTitle>Welcome to Apollo Quotes</FormTitle>
        <fieldset disabled={loading} aria-busy={loading}>
          <label htmlFor="email">
            Email
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
              autoComplete="email"
              autoFocus
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
              autoComplete="current-password"
              required
            />
          </label>
          <p>{errors.password && errors.password}</p>
          <input type="submit" value="Sign In" disabled={disabled} />
        </fieldset>
        <div className="link">
          <Link href="/signup">
            <a>Create a new account</a>
          </Link>
        </div>
      </Form>
    </FormContainer>
  ) : (
    <div>Loading....</div>
  );
};
