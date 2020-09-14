import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import { useRouter } from "next/router";
import Link from "next/link";
import { RouterContext } from "next/dist/next-server/lib/router-context";
import { Navbar } from "../components/Navbar";
import { AuthProvider } from "../components/Auth";
import { CURRENT_USER_QUERY } from "../components/Auth";

let mutationWasCalled = false;

jest.mock("next/link", () => {
  return ({ children }) => {
    return children;
  };
});

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
    const { getByText, queryByText } = render(
      <MockedProvider mocks={userNotSignedInMocks}>
        <Navbar />
      </MockedProvider>
    );

    expect(getByText("Quotes")).toBeInTheDocument();
    expect(getByText("Sign In")).toBeInTheDocument();
    expect(queryByText("My Quotes")).not.toBeInTheDocument();
    expect(queryByText("Likes")).not.toBeInTheDocument();
    expect(queryByText("New")).not.toBeInTheDocument();
    expect(queryByText("Log out")).not.toBeInTheDocument();
  });

  it("shows home, my quotes, likes, new and logout icons whened not signed in", async () => {
    const { getByText, queryByText } = render(
      <MockedProvider mocks={userSignedInMocks}>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(mutationWasCalled).toBe(true);
    });

    expect(getByText("Quotes")).toBeInTheDocument();

    await waitFor(() => expect(queryByText("Sign In")).not.toBeInTheDocument());

    expect(getByText("My Quotes")).toBeInTheDocument();
    expect(getByText("Likes")).toBeInTheDocument();
    expect(getByText("New")).toBeInTheDocument();
    expect(screen.getByText("Log out")).toBeInTheDocument();
  });
  // TODO: work out how to test route changes
  // it("navigates to the correct routes for each icon when clicked", async () => {
  //   const router = {
  //     basePath: "",
  //     pathname: "/",
  //     route: "/",
  //     asPath: "/",
  //     query: {},
  //     push: jest.fn(),
  //     replace: jest.fn(),
  //     reload: jest.fn(),
  //     back: jest.fn(),
  //     prefetch: jest.fn(),
  //     beforePopState: jest.fn(),
  //     events: {
  //       on: jest.fn(),
  //       off: jest.fn(),
  //       emit: jest.fn(),
  //     },
  //     isFallback: false,
  //   };

  //   const { getByText, queryByText } = render(
  //     <MockedProvider mocks={userSignedInMocks}>
  //       <AuthProvider>
  //         <RouterContext.Provider value={router}>
  //           <Navbar />
  //         </RouterContext.Provider>
  //       </AuthProvider>
  //     </MockedProvider>
  //   );

  //   await waitFor(() => {
  //     expect(mutationWasCalled).toBe(true);
  //   });

  //   await userEvent.click(getByText("Quotes"));

  //   await waitFor(() => {
  //     expect(router.pathname).toBe("/");
  //   });

  //   await userEvent.click(getByText("My Quotes"));

  //   await waitFor(() => {
  //     expect(router.pathname).toBe(`/user/jeffrey/quotes`);
  //   });
  // });
});
