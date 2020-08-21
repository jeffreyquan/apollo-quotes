import Link from "next/link";
import styled from "styled-components";
import { AuthContext } from "./Auth";
import { Logout } from "./Logout";

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
  return (
    <AuthContext.Consumer>
      {({ user }) => (
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
            {!user ? (
              <Link href="/signin">
                <a>Sign In</a>
              </Link>
            ) : (
              <Logout />
            )}
          </ul>
        </NavbarStyles>
      )}
    </AuthContext.Consumer>
  );
};
