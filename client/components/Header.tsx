import Link from "next/link";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { IoIosRocket } from "react-icons/io";
import { Navbar } from "./Navbar";

const Logo = styled.div`
  font-size: 3rem;
  margin-right: auto;
  a {
    display: flex;
    align-items: center;
  }
`;

const StyledHeader = styled.header`
  position: sticky;
  background-color: ${(props) =>
    props.sticky ? props.theme.white : "transparent"};
  box-shadow: ${(props) =>
    props.sticky ? `0 0.2rem 0.5rem rgba(0,0,0,0.5)` : ""};
  top: 0;
  display: flex;
  align-items: center;
  transition: all 0.3s ease-in-out;
  line-height: ${(props) => (props.sticky ? "3rem" : "5rem")};
  max-height: 9rem;
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
      <Logo>
        <Link href="/">
          <a>
            <IoIosRocket />
            Apollo Quotes
          </a>
        </Link>
      </Logo>
      <Navbar />
    </StyledHeader>
  );
};
