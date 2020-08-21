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

export const SignUp = () => {
  const { inputs, handleChange, resetForm } = useForm({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmationPassword: "",
  });
  const { name, username, email, password, confirmationPassword } = inputs;

  let { user, setUser } = useContext(AuthContext);

  const [loadingPage, setLoadingPage] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  const handleSubmit = (e) => {
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
          <label htmlFor="password">
            Confirm Password
            <input
              type="password"
              name="password"
              placeholder="Confirmaton Password"
              value={confirmationPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </label>
          <input type="submit" value="Sign Up" />
        </fieldset>
      </Form>
    </FormContainer>
  ) : (
    <div>Loading...</div>
  );
};
