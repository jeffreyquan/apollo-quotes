import Link from "next/link";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { IoIosRocket } from "react-icons/io";
import { Navbar } from "./Navbar";

const Logo = styled.div`
  font-size: 3rem;
  margin-right: auto;
  padding: 2rem 0;
  @media only screen and (max-width: ${(props) => props.theme.smallbp}) {
    margin-right: 0;
    justify-content: center;
  }
  a {
    display: flex;
    align-items: center;
  }
`;

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  position: sticky;
  background-color: ${(props) =>
    props.sticky ? props.theme.white : "transparent"};
  top: 0;
  max-height: 9rem;
  box-shadow: ${(props) =>
    props.sticky ? `0 0.2rem 0.5rem rgba(0,0,0,0.5)` : ""};

  transition: all 0.3s ease-in-out;
  line-height: ${(props) => (props.sticky ? "3rem" : "5rem")};

  div {
    display: flex;
    align-items: center;
    width: 100%;
    margin: 0 auto;
    max-width: ${(props) => props.theme.maxWidth};
  }

  @media only screen and (max-width: 600px) {
    justify-content: center;
  }
`;

export const Header = () => {
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 0) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    });
  }, []);

  return (
    <StyledHeader sticky={sticky}>
      <div>
        <Logo>
          <Link href="/">
            <a>
              <IoIosRocket />
              Apollo Quotes
            </a>
          </Link>
        </Logo>
        <Navbar />
      </div>
    </StyledHeader>
  );
};
