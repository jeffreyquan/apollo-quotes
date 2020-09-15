import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import { useRouter } from "next/router";
import { CREATE_QUOTE_MUTATION, QuoteNew } from "../components/QuoteNew";
import { testNewQuote } from "../lib/testUtils";

const mockRouterPush = jest.fn();

jest.mock("next/router", () => ({
  ...jest.requireActual("next/router"),
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

const mocks = [
  {
    request: {
      query: CREATE_QUOTE_MUTATION,
      variables: {
        content: "Hello World",
        author: "CS",
        image: "",
        tags: ["power", "life"],
      },
    },
    result: {
      data: {
        createQuote: {
          __typename: "Quote",
          id: "abcd123",
          author: "CS",
          content: "Hello World",
          image: "",
          largeImage: "",
          tags: [
            { id: "tag123", name: "power", __typename: "Tag" },
            { id: "tag124", name: "life", __typename: "Tag" },
          ],
          likes: [],
          slug: "hello-world-cs",
        },
      },
    },
  },
];

describe("QuoteNew", () => {
  it("renders all inputs and labels", () => {
    const { getByRole, getByLabelText } = render(
      <MockedProvider>
        <QuoteNew />
      </MockedProvider>
    );

    expect(
      getByRole("heading", { name: "Submit a new quote" })
    ).toBeInTheDocument();

    expect(getByLabelText("Content")).toBeInTheDocument();

    expect(getByLabelText("Author")).toBeInTheDocument();

    expect(getByLabelText("Image")).toBeInTheDocument();

    expect(getByLabelText("Tags")).toBeInTheDocument();

    expect(getByRole("button", { name: "Submit" })).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("When nothing goes right, go left.")
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("JR Smith")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Upload an image")).toBeInTheDocument();
  });

  it("creates a new quote", async () => {
    const { getByPlaceholderText, getByRole } = render(
      <MockedProvider mocks={mocks}>
        <QuoteNew />
      </MockedProvider>
    );

    const router = useRouter();

    await userEvent.type(
      getByPlaceholderText("When nothing goes right, go left."),
      testNewQuote.content
    );

    await userEvent.type(getByPlaceholderText("JR Smith"), testNewQuote.author);

    await userEvent.type(
      getByPlaceholderText("power"),
      testNewQuote.tags[0].name
    );

    await userEvent.click(screen.getByTestId("addTag"));

    await userEvent.type(
      getByPlaceholderText("power"),
      testNewQuote.tags[1].name
    );

    await userEvent.click(screen.getByTestId("addTag"));

    await userEvent.type(getByPlaceholderText("power"), "chicken");

    await userEvent.click(screen.getByTestId("addTag"));

    expect(screen.getByText("chicken")).toBeInTheDocument();

    await userEvent.click(screen.getByText("chicken"));

    expect(screen.queryByText("chicken")).not.toBeInTheDocument();

    await userEvent.click(getByRole("button", { name: "Submit" }));

    await waitFor(() =>
      expect(router.push).toHaveBeenCalledWith(
        "/quotes/[slug]",
        `/quotes/${testNewQuote.slug}`
      )
    );
  });
});
