import { render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { Navbar } from "../components/Navbar";
import { AuthProvider } from "../components/Auth";
import { CURRENT_USER_QUERY } from "../components/Auth";

let mutationWasCalled = false;

const userSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: () => {
      mutationWasCalled = true;
      return {
        data: {
          userProfile: {
            id: "abcd",
            name: "Jeffrey",
            username: "jeffrey",
            email: "jeffrey@example.com",
            role: "ADMIN",
            __typename: "User",
          },
        },
      };
    },
  },
];

const userNotSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        userProfile: null,
      },
    },
  },
];

describe("Navbar", () => {
  it("shows home and sign in icons when not signed in", async () => {
    const { getByRole, queryByRole } = render(
      <MockedProvider mocks={userNotSignedInMocks}>
        <Navbar />
      </MockedProvider>
    );

    expect(getByRole("link", { name: "Quotes" })).toBeInTheDocument();
    expect(getByRole("link", { name: "Sign In" })).toBeInTheDocument();
    expect(queryByRole("link", { name: "My Quotes" })).not.toBeInTheDocument();
    expect(queryByRole("link", { name: "Likes" })).not.toBeInTheDocument();
    expect(queryByRole("link", { name: "New" })).not.toBeInTheDocument();
    expect(queryByRole("link", { name: "Log out" })).not.toBeInTheDocument();
  });

  it("shows home, my quotes, likes, new and logout icons whened not signed in", async () => {
    const { getByRole, queryByRole } = render(
      <MockedProvider mocks={userSignedInMocks}>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(mutationWasCalled).toBe(true);
    });

    expect(getByRole("link", { name: "Quotes" })).toBeInTheDocument();
    await waitFor(() =>
      expect(queryByRole("link", { name: "Sign In" })).not.toBeInTheDocument()
    );
    expect(getByRole("link", { name: "My Quotes" })).toBeInTheDocument();
    expect(getByRole("link", { name: "Likes" })).toBeInTheDocument();
    expect(getByRole("link", { name: "New" })).toBeInTheDocument();
    expect(screen.getByText("Log out")).toBeInTheDocument();
  });
});
