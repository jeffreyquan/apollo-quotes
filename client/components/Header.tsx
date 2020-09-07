import Link from "next/link";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { BsMoon, BsSun } from "react-icons/bs";
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
    props.sticky ? props.theme.bg : "transparent"};
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

const StyledSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px; /* 2 x (slider:before width + left) */
  height: 24px; /* slider:before height + 2 x slider:before bottom */
  flex: 0 0 auto;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #000000;
    -webkit-transition: 0.3s;
    transition: 0.3s;
    display: flex;
    justify-content: space-around;

    svg {
      color: gold;
    }

    &:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      -webkit-transition: 0.3s;
      transition: 0.3s;
    }

    &.round {
      border-radius: 24px; /* same as label height */

      &:before {
        border-radius: 50%;
      }
    }
  }

  input:focus + .slider {
    box-shadow: 0 0 1px ${(props) => props.theme.link};

    .round {
      border: 2px solid pink;
    }
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(20px); /* same as slider:before width */
    -ms-transform: translateX(20px); /* same as slider:before */
    transform: translateX(20px);
  }
`;

export const Header = ({ theme, toggleTheme }) => {
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
        <StyledSwitch>
          <input
            name="themeSelector"
            type="checkbox"
            onChange={toggleTheme}
            checked={theme === "dark"}
          />
          <div className="slider round">
            <BsMoon />
            <BsSun />
          </div>
        </StyledSwitch>
      </div>
    </StyledHeader>
  );
};
