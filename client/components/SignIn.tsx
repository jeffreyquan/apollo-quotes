import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";
import { AuthContext } from "./Auth";
import { useForm } from "../lib/useForm";
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

  const { email, password } = inputs;

  const [loadingPage, setLoadingPage] = useState(true);

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

  const [login, { error, loading }] = useMutation(LOGIN_MUTATION, {
    variables: inputs,
  });

  // TODO: create error component to display any login errors
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login();
      setUser(res.data.login);
    } catch (err) {
      console.log(err);
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
          <input type="submit" value="Sign In" />
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
