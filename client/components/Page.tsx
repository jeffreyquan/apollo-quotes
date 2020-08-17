import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import { useContext } from "react";
import { AuthContext } from "./Auth";
import { Header } from "./Header";

// https://www.happyhues.co/palettes/11
const theme = {
  bg: "#f9f4ef",
  headline: "#020826",
  body: "#716040",
  subheadline: "#716040",
  btn: "#8c7851",
  btntext: "#fffffe",
  bg2: "#fffffe",
  headline2: "#020826",
  subheadline2: "#716040",
  cardbg: "#eaddcf",
  cardheadline: "#020826",
  cardbody: "#716040",
  cardbg2: "#fffffe",
  cardheadline2: "#020826",
  cardbody2: "#716040",
  cardtagbg: "#8c7851",
  cardtagtext: "#fffffe",
  cardhl: "#f25042",
  link: "#8c7851",
  formheadline: "#fffffe",
  formbg: "#8c7851",
  forminput: "#eaddcf",
  formtext: "#020826",
  formbtntext: "#fffffe",
  white: "#ffffff",
  black: "#000000",
  maxWidth: "960px",
};

const StyledPage = styled.div`
  background: ${(props) => props.theme.bg};
  color: ${(props) => props.theme.black};
`;

const InnerDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  max-width: ${(props) => props.theme.maxWidth};
  min-height: ${(props) => (props.loading ? "100vh" : "calc(100vh - 9rem)")};
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

  return (
    <ThemeProvider theme={theme}>
      <StyledPage>
        <GlobalStyles />
        {checkingAuth ? (
          <InnerDiv loading="true">Loading...</InnerDiv>
        ) : (
          <>
            <Header />
            <InnerDiv>{children}</InnerDiv>
          </>
        )}
      </StyledPage>
    </ThemeProvider>
  );
};
