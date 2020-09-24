import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { SignUp } from "../components/SignUp";

describe("Sign Up", () => {
  it("renders all inputs and labels", () => {
    const { getByRole, getByLabelText } = render(
      <MockedProvider>
        <SignUp />
      </MockedProvider>
    );

    expect(getByLabelText("Name")).toBeInTheDocument();

    expect(getByLabelText("Username")).toBeInTheDocument();

    expect(getByLabelText("Email")).toBeInTheDocument();

    expect(getByLabelText("Password")).toBeInTheDocument();

    expect(getByLabelText("Confirm Password")).toBeInTheDocument();

    expect(getByRole("textbox", { name: "Name" })).toBeInTheDocument();

    expect(getByRole("textbox", { name: "Username" })).toBeInTheDocument();

    expect(
      getByRole("heading", { name: "Join the Apollo Quotes community" })
    ).toBeInTheDocument();

    expect(getByRole("textbox", { name: "Email" })).toBeInTheDocument();

    expect(getByRole("button", { name: "Sign Up" })).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Confirmaton Password")
    ).toBeInTheDocument();
  });
});
