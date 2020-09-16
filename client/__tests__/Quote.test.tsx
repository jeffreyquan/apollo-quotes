import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import { useRouter } from "next/router";
import { Quote, LIKE_MUTATION } from "../components/Quote";
import { SINGLE_QUOTE_QUERY } from "../components/SingleQuote";
import { AuthProvider } from "../components/Auth";
import { CURRENT_USER_QUERY } from "../components/Auth";
import {
  fakeCache,
  fakeQuoteWithoutUserLike,
  fakeQuoteWithUserLike,
} from "../lib/testUtils";

const mockRouterPush = jest.fn();

const quoteWithoutUserLike = fakeQuoteWithoutUserLike();

const quoteWithUserLike = fakeQuoteWithUserLike();

jest.mock("next/router", () => ({
  ...jest.requireActual("next/router"),
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

describe("Quote", () => {
  it("renders and matches snapshot when user is not signed in", () => {
    const { container } = render(
      <MockedProvider>
        <Quote quote={quoteWithoutUserLike} />
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders and matches snapshot when user is signed in and quote belongs to user", async () => {
    let currentUserQueryCalled = false;
    const mocks = [
      {
        request: { query: CURRENT_USER_QUERY },
        result: () => {
          currentUserQueryCalled = true;

          return {
            data: {
              userProfile: {
                id: "abc123",
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

    const { container, getByTestId } = render(
      <MockedProvider mocks={mocks}>
        <AuthProvider>
          <Quote quote={quoteWithoutUserLike} />
        </AuthProvider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(currentUserQueryCalled).toBe(true);
    });

    expect(getByTestId("editButton")).toBeInTheDocument();

    expect(getByTestId("deleteButton")).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it("renders the image", () => {
    render(
      <MockedProvider>
        <Quote quote={quoteWithoutUserLike} />
      </MockedProvider>
    );
    const img = screen.getByAltText(quoteWithoutUserLike.author);
    expect(img).toBeInTheDocument();
  });

  it("renders the content", () => {
    const { getByTestId } = render(
      <MockedProvider>
        <Quote quote={quoteWithoutUserLike} />
      </MockedProvider>
    );

    expect(getByTestId("quoteContent")).toHaveTextContent(
      quoteWithoutUserLike.content
    );
  });

  it("renders the author", () => {
    const { getByTestId } = render(
      <MockedProvider>
        <Quote quote={quoteWithoutUserLike} />
      </MockedProvider>
    );

    expect(getByTestId("quoteAuthor")).toHaveTextContent(
      quoteWithoutUserLike.author
    );
  });

  it("renders the right number of tags", () => {
    const { getAllByTestId } = render(
      <MockedProvider>
        <Quote quote={quoteWithoutUserLike} />
      </MockedProvider>
    );

    expect(getAllByTestId("quoteTag")).toHaveLength(2);
  });

  it("renders the tags properly", () => {
    const { getAllByTestId } = render(
      <MockedProvider>
        <Quote quote={quoteWithoutUserLike} />
      </MockedProvider>
    );
    for (let i = 0; i < quoteWithoutUserLike.tags.length; i++) {
      const quoteTags = getAllByTestId("quoteTag");
      expect(quoteTags[i]).toHaveTextContent(quoteWithoutUserLike.tags[i].name);
    }
  });

  it("renders the correct number of likes", () => {
    const { getByTestId } = render(
      <MockedProvider>
        <Quote quote={quoteWithoutUserLike} />
      </MockedProvider>
    );

    expect(getByTestId("likeCount")).toHaveTextContent(
      `${quoteWithoutUserLike.likes.length}`
    );
  });

  it("increases the like count by 1 when quote is liked", async () => {
    const cache = fakeCache();

    cache.writeQuery({
      query: SINGLE_QUOTE_QUERY,
      variables: { slug: "forrest-gump" },
      data: {
        quote: {
          ...quoteWithoutUserLike,
        },
      },
    });

    let currentUserQueryCalled = false;
    let likeMutationCalled = false;

    const userLikedQuoteMocks = [
      {
        request: { query: CURRENT_USER_QUERY },
        result: () => {
          currentUserQueryCalled = true;

          return {
            data: {
              userProfile: {
                id: "abc123",
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
      {
        request: {
          query: LIKE_MUTATION,
          variables: {
            quoteId: quoteWithoutUserLike.id,
          },
        },
        result: () => {
          likeMutationCalled = true;

          return {
            data: {
              likeQuote: {
                id: "like123",
                quote: {
                  id: quoteWithoutUserLike.id,
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
                    ...quoteWithoutUserLike.likes,
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
      <MockedProvider mocks={userLikedQuoteMocks} cache={cache}>
        <AuthProvider>
          <Quote quote={quoteWithoutUserLike} />
        </AuthProvider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(currentUserQueryCalled).toBe(true);
    });

    expect(getByTestId("likeCount")).toHaveTextContent(
      `${quoteWithoutUserLike.likes.length}`
    );

    const likeButton = getByTestId("likeButton");

    await userEvent.click(likeButton);

    await waitFor(() => {
      expect(likeMutationCalled).toBe(true);
    });

    const { quote } = cache.readQuery({
      query: SINGLE_QUOTE_QUERY,
      variables: { slug: "forrest-gump" },
    });

    rerender(
      <MockedProvider mocks={userLikedQuoteMocks} cache={cache}>
        <AuthProvider>
          <Quote quote={quote} />
        </AuthProvider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        getByText(`${quoteWithoutUserLike.likes.length + 1}`)
      ).toBeInTheDocument();
    });
  });

  it("decreases the like count by 1 when quote is unliked", async () => {
    const cache = fakeCache();

    cache.writeQuery({
      query: SINGLE_QUOTE_QUERY,
      variables: { slug: "forrest-gump" },
      data: {
        quote: {
          ...quoteWithUserLike,
        },
      },
    });

    let currentUserQueryCalled = false;
    let likeMutationCalled = false;

    const userUnlikedQuoteMocks = [
      {
        request: { query: CURRENT_USER_QUERY },
        result: () => {
          currentUserQueryCalled = true;

          return {
            data: {
              userProfile: {
                id: "abc123",
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
      {
        request: {
          query: LIKE_MUTATION,
          variables: {
            quoteId: quoteWithUserLike.id,
          },
        },
        result: () => {
          likeMutationCalled = true;

          return {
            data: {
              likeQuote: {
                id: "like123",
                quote: {
                  id: quoteWithUserLike.id,
                  likes: [...quoteWithoutUserLike.likes], // result of unliking a quote is that the quote will no longer have a like belonging to the user
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
      <MockedProvider mocks={userUnlikedQuoteMocks} cache={cache}>
        <AuthProvider>
          <Quote quote={quoteWithUserLike} />
        </AuthProvider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(currentUserQueryCalled).toBe(true);
    });

    expect(getByTestId("likeCount")).toHaveTextContent(
      `${quoteWithUserLike.likes.length}`
    );

    const unlikeButton = screen.queryByTestId("unlikeButton");

    expect(unlikeButton).toBeInTheDocument();

    await userEvent.click(unlikeButton);

    await waitFor(() => {
      expect(likeMutationCalled).toBe(true);
    });

    const { quote } = cache.readQuery({
      query: SINGLE_QUOTE_QUERY,
      variables: { slug: "forrest-gump" },
    });

    rerender(
      <MockedProvider mocks={userUnlikedQuoteMocks} cache={cache}>
        <AuthProvider>
          <Quote quote={quote} />
        </AuthProvider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(
        getByText(`${quoteWithUserLike.likes.length - 1}`)
      ).toBeInTheDocument();
    });
  });

  it("navigates to correct route when tags are clicked", async () => {
    const { getByText } = render(
      <MockedProvider>
        <Quote quote={quoteWithoutUserLike} />
      </MockedProvider>
    );

    for (let i = 0; i < quoteWithoutUserLike.tags.length; i++) {
      const tag = getByText(quoteWithoutUserLike.tags[i].name);

      const router = useRouter();

      await userEvent.click(tag);

      await waitFor(() =>
        expect(router.push).toHaveBeenCalledWith({
          pathname: "/quotes",
          query: { tag: quoteWithoutUserLike.tags[i].name },
        })
      );
    }
  });
});
