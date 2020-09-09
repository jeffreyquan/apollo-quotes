import { MockedProvider } from "@apollo/client/testing";
import { Quote } from "../components/Quote";
import { mount, shallow } from "enzyme";

const testQuote = {
  id: "aioerojwo432",
  author: "Forrest Gump, Forrest Gump",
  content:
    "Life was like a box of chocolates. You never know what you're gonna get.",
  image: "https://www.fillmurray.com/200/300",
  likes: [
    { id: "abc", username: "John" },
    { id: "abd", username: "Ben" },
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
});
