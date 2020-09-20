import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import { useContext } from "react";
import { useTheme } from "../lib/useTheme";
import { AuthContext } from "./Auth";
import { Header } from "./Header";
import { Meta } from "./Meta";
import { PageLoader } from "./PageLoader";

const darkTheme = {
  bg: "#282e34",
  headline: "#ffffff",
  body: "#383d49",
  subheadline: "#383d49",
  btnbg: "#d54473",
  btntext: "#e7e7e9",
  cardbg: "#383d48",
  cardheadline: "#ffffff",
  cardbody: "#ffffff",
  cardtagbg: "#d54473",
  cardtagtext: "#e7e7e9",
  cardhl: "#f25042",
  link: "#d54473",
  formheadline: "#e7e7e9",
  formbg: "#383d48",
  forminputbg: "#ffffff",
  formtext: "#000000",
  formbtntext: "#ffffff",
  errortext: "#ff9999",
  loader: "#d54473",
  white: "#ffffff",
  black: "#000000",
  smallbp: "600px",
  maxWidth: "960px",
};

// https://www.happyhues.co/palettes/11
const lightTheme = {
  bg: "#f9f4ef",
  headline: "#020826",
  body: "#716040",
  subheadline: "#716040",
  btnbg: "#8c7851",
  btntext: "#fffffe",
  cardbg: "#fffffe",
  cardheadline: "#020826",
  cardbody: "#716040",
  cardtagbg: "#8c7851",
  cardtagtext: "#fffffe",
  cardhl: "#f25042",
  link: "#8c7851",
  formheadline: "#fffffe",
  formbg: "#8c7851",
  forminputbg: "#eaddcf",
  formtext: "#020826",
  formbtntext: "#fffffe",
  errortext: "#ff9999",
  loader: "#8c7851",
  white: "#ffffff",
  black: "#000000",
  smallbp: "600px",
  maxWidth: "960px",
};

const StyledPage = styled.div`
  background: ${(props) => props.theme.bg};
  color: ${(props) => props.theme.headline};
  display: flex;
  flex-direction: column;
`;

const InnerDiv = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  max-width: ${(props) => props.theme.maxWidth};
  min-height: ${(props) => (props.loading ? "100vh" : "calc(100vh - 9rem)")};
  @media only screen and (max-width: ${(props) => props.theme.smallbp}) {
    overflow-y: auto;
  }
`;

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after  {
    margin: 0;
    padding: 0;
    box-sizing: inherit;
  }

  html {
    box-sizing: border-box;
    font-size: 62.5%;
  }

  body {
    font-family: "Helvetica Neue", sans serif;
    font-size: 1.4rem;
    line-height: 1.6;
  }

  a {
    text-decoration: none;
    color: ${(props) => props.theme.link}
  }
`;

export const Page = ({ children }) => {
  const { checkingAuth } = useContext(AuthContext);
  const [theme, toggleTheme, mounted] = useTheme();
  const selectedTheme = theme === "light" ? lightTheme : darkTheme;

  if (!mounted)
    return (
      <div
        style={{ display: "flex", justifyContent: "center", height: "100vh" }}
      >
        Loading...
      </div>
    );

  return (
    <ThemeProvider theme={selectedTheme}>
      <StyledPage>
        <GlobalStyles />
        <Meta />
        <Header theme={theme} toggleTheme={toggleTheme} />
        {checkingAuth ? (
          <InnerDiv loading="true">
            <PageLoader />
          </InnerDiv>
        ) : (
          <>
            <InnerDiv>{children}</InnerDiv>
          </>
        )}
      </StyledPage>
    </ThemeProvider>
  );
};
