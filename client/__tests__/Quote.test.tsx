import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import { useRouter } from "next/router";
import { Quote, LIKE_MUTATION } from "../components/Quote";
import { SINGLE_QUOTE_QUERY } from "../components/SingleQuote";
import { testCache, testQuote } from "../lib/testUtils";

const mockRouterPush = jest.fn();

jest.mock("next/router", () => ({
  ...jest.requireActual("next/router"),
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

describe("<Quote />", () => {
  it("renders the image properly", () => {
    render(
      <MockedProvider>
        <Quote quote={testQuote} />
      </MockedProvider>
    );
    const img = screen.getByAltText(testQuote.author);
    expect(img).toBeInTheDocument();
  });

  it("renders the content", () => {
    const { getByTestId } = render(
      <MockedProvider>
        <Quote quote={testQuote} />
      </MockedProvider>
    );

    expect(getByTestId("quoteContent")).toHaveTextContent(testQuote.content);
  });

  it("renders the author", () => {
    const { getByTestId } = render(
      <MockedProvider>
        <Quote quote={testQuote} />
      </MockedProvider>
    );

    expect(getByTestId("quoteAuthor")).toHaveTextContent(testQuote.author);
  });

  it("renders the right number of tags", () => {
    const { getAllByTestId } = render(
      <MockedProvider>
        <Quote quote={testQuote} />
      </MockedProvider>
    );

    expect(getAllByTestId("quoteTag")).toHaveLength(2);
  });

  it("renders the tags properly", () => {
    const { getAllByTestId } = render(
      <MockedProvider>
        <Quote quote={testQuote} />
      </MockedProvider>
    );
    for (let i = 0; i < testQuote.tags.length; i++) {
      const quoteTags = getAllByTestId("quoteTag");
      expect(quoteTags[i]).toHaveTextContent(testQuote.tags[i].name);
    }
  });

  it("renders the correct number of likes", () => {
    const { getByTestId } = render(
      <MockedProvider>
        <Quote quote={testQuote} />
      </MockedProvider>
    );

    expect(getByTestId("likeCount")).toHaveTextContent(
      `${testQuote.likes.length}`
    );
  });

  it("increases the like count by 1 when quote is liked", async () => {
    const cache = testCache;

    cache.writeQuery({
      query: SINGLE_QUOTE_QUERY,
      variables: { slug: "forrest-gump" },
      data: {
        quote: {
          ...testQuote,
        },
      },
    });

    let mutationWasCalled = false;

    const mocks = [
      {
        request: {
          query: LIKE_MUTATION,
          variables: {
            quoteId: testQuote.id,
          },
        },
        result: () => {
          mutationWasCalled = true;

          return {
            data: {
              likeQuote: {
                id: "like123",
                quote: {
                  id: testQuote.id,
                  likes: [
                    {
                      id: "like123",
                      user: {
                        id: "abc123",
                        username: "jeffrey",
                        __typename: "User",
                      },
                      __typename: "Like",
                    },
                    ...testQuote.likes,
                  ],
                  __typename: "Quote",
                },
                user: {
                  id: "abc123",
                  username: "jeffrey",
                  __typename: "User",
                },
                __typename: "Like",
              },
            },
          };
        },
      },
    ];

    const { getByTestId, getByText, rerender } = render(
      <MockedProvider mocks={mocks} cache={cache}>
        <Quote quote={testQuote} />
      </MockedProvider>
    );

    const likeButton = getByTestId("likeButton");

    await userEvent.click(likeButton);

    await waitFor(() => {
      expect(mutationWasCalled).toBe(true);
    });

    const { quote } = cache.readQuery({
      query: SINGLE_QUOTE_QUERY,
      variables: { slug: "forrest-gump" },
    });

    rerender(
      <MockedProvider mocks={mocks} cache={cache}>
        <Quote quote={quote} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByText("3")).toBeInTheDocument();
    });
  });

  it("navigates to correct route when tags are clicked", async () => {
    const { getByText } = render(
      <MockedProvider>
        <Quote quote={testQuote} />
      </MockedProvider>
    );

    for (let i = 0; i < testQuote.tags.length; i++) {
      const tag = getByText(testQuote.tags[i].name);

      const router = useRouter();

      await userEvent.click(tag);

      await waitFor(() =>
        expect(router.push).toHaveBeenCalledWith({
          pathname: "/quotes",
          query: { tag: testQuote.tags[i].name },
        })
      );
    }
  });
});
