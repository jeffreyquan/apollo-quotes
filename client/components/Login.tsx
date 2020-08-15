import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "../lib/useForm";
import { Form } from "../styles/Form";
import { FormContainer } from "../styles/FormContainer";
import { FormTitle } from "../styles/FormTitle";
import { useUser } from "./User";

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

export const Login = () => {
  const { inputs, handleChange, resetForm } = useForm({
    email: "",
    password: "",
  });

  const { email, password } = inputs;

  const [loadingPage, setLoadingPage] = useState(true);
  const user = useUser();
  const router = useRouter();
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      setLoadingPage(true);
      if (user) {
        router.push("/");
      } else {
        setLoadingPage(false);
      }
    } else {
      isMounted.current = true;
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
      if (res.data.login.id) {
        // TODO: only go back to previous route if redirected to login page
        console.log(window.history);
        router.back();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return !loadingPage ? (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <FormTitle>Login</FormTitle>
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
            />
          </label>
          <input type="submit" value="Sign In" />
        </fieldset>
      </Form>
    </FormContainer>
  ) : (
    <div>Loading....</div>
  );
};
