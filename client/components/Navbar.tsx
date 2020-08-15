import Link from "next/link";
import styled from "styled-components";
import { useUser } from "./User";

const NavbarStyles = styled.nav`
  font-size: 2rem;
  ul {
    display: flex;

    a {
      color: ${(props) => props.theme.headline2};
      padding: 2rem 1rem;
    }
  }
`;

export const Navbar = () => {
  const user = useUser();

  return (
    <NavbarStyles>
      <ul>
        <Link href="/quotes">
          <a>Quotes</a>
        </Link>
        {user && (
          <>
            <Link href="/quotes/new">
              <a>New</a>
            </Link>
          </>
        )}
        {!user && (
          <Link href="/login">
            <a>Login</a>
          </Link>
        )}
      </ul>
    </NavbarStyles>
  );
};
