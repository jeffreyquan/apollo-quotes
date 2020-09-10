import { ApolloConsumer } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { mount } from "enzyme";
import {
  Quote,
  QuoteContent,
  Controls,
  LIKE_MUTATION,
} from "../components/Quote";

const testQuote = {
  id: "aioerojwo432",
  author: "Forrest Gump, Forrest Gump",
  content:
    "Life was like a box of chocolates. You never know what you're gonna get.",
  image: "https://www.fillmurray.com/200/300",
  likes: [
    { id: "abc", user: { id: "abd123", username: "John" } },
    { id: "abd", user: { id: "abe123", username: "Ben" } },
  ],
  tags: [
    { id: "abe", name: "movie" },
    { id: "abf", name: "life" },
  ],
};

describe("<Quote />", () => {
  it("renders the image properly", () => {
    const wrapper = mount(
      <MockedProvider>
        <Quote quote={testQuote} />
      </MockedProvider>
    );
    const img = wrapper.find("img");
    expect(img.props().src).toBe(testQuote.image);
    expect(img.props().alt).toBe(testQuote.author);
  });

  it("renders the content", () => {
    const wrapper = mount(
      <MockedProvider>
        <Quote quote={testQuote} />
      </MockedProvider>
    );
    expect(wrapper.find(QuoteContent).find("p").at(0).find("span").text()).toBe(
      testQuote.content
    );
  });

  it("renders the author", () => {
    const wrapper = mount(
      <MockedProvider>
        <Quote quote={testQuote} />
      </MockedProvider>
    );

    expect(wrapper.find(QuoteContent).find("p").at(1).find("span").text()).toBe(
      testQuote.author
    );
  });

  it("renders the right number of tags", () => {
    const wrapper = mount(
      <MockedProvider>
        <Quote quote={testQuote} />
      </MockedProvider>
    );
    expect(wrapper.find("QuoteTag")).toHaveLength(2);
  });

  it("renders the tags properly", () => {
    const wrapper = mount(
      <MockedProvider>
        <Quote quote={testQuote} />
      </MockedProvider>
    );
    for (let i = 0; i < testQuote.tags.length; i++) {
      expect(wrapper.find("QuoteTag").at(i).text()).toBe(
        testQuote.tags[i].name
      );
    }
  });

  it("renders the correct number of likes", () => {
    const wrapper = mount(
      <MockedProvider>
        <Quote quote={testQuote} />
      </MockedProvider>
    );

    expect(wrapper.find(Controls).find("div span").text()).toBe(
      `${testQuote.likes.length}`
    );
  });

  // TODO: get this test working
  it("increases the like count by 1 when quote is liked", async () => {
    const mocks = [
      {
        request: {
          query: LIKE_MUTATION,
          variables: {
            quoteId: testQuote.id,
          },
        },
        result: {
          data: {
            likeQuote: {
              id: "abg",
              quote: {
                id: testQuote.id,
                likes: [
                  ...testQuote.likes,
                  {
                    id: "like123",
                    user: { id: "abc123", username: "jeffrey" },
                  },
                ],
              },
              user: {
                id: "abc123",
                username: "jeffrey",
              },
              __typename: "Like",
            },
          },
        },
      },
    ];

    let apolloClient;

    const wrapper = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ApolloConsumer>
          {(client) => {
            apolloClient = client;
            return <Quote quote={testQuote} />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );

    const likeBtn = wrapper.find('svg[data-test="like-btn"]');

    expect(likeBtn).toHaveLength(1);

    likeBtn.simulate("click");

    await new Promise((resolve) => setTimeout(resolve, 50));

    wrapper.update();

    expect(wrapper.find(Controls).find("div span").text()).toBe(
      `${testQuote.likes.length + 1}`
    );
  });
});
