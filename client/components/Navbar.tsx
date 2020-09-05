import Link from "next/link";
import styled from "styled-components";
import { AiFillHome } from "react-icons/ai";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import {
  MdInsertDriveFile,
  MdAssignmentInd,
  MdNoteAdd,
  MdTurnedIn,
  MdAddBox,
  MdCreateNewFolder,
} from "react-icons/md";
import { RiHomeHeartLine } from "react-icons/ri";
import { AuthContext } from "./Auth";
import { Logout } from "./Logout";

const IconStyles = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.4;
  font-size: 1.2rem;

  p {
    white-space: nowrap;
  }

  svg {
    font-size: 3rem;
  }
`;

const NavbarStyles = styled.nav`
  @media only screen and (max-width: ${(props) => props.theme.smallbp}) {
    display: flex;
    background-color: ${(props) => props.theme.white};
    justify-content: center;
    position: fixed;
    align-items: center;
    bottom: 0;
    width: 100%;
    height: 9rem;
  }

  ul {
    display: flex;
    align-items: center;

    a {
      color: ${(props) => props.theme.headline2};
      padding: 2rem 1rem;
    }
  }
`;

const IconContainer = ({ children }) => {
  return <IconStyles>{children}</IconStyles>;
};

export const Navbar = () => {
  return (
    <AuthContext.Consumer>
      {({ user }) => (
        <NavbarStyles>
          <ul>
            <Link href="/">
              <a>
                <IconContainer>
                  <AiFillHome />
                  <p>Quotes</p>
                </IconContainer>
              </a>
            </Link>
            {user && (
              <>
                <Link
                  href="/user/[...slug]"
                  as={`/user/${user.username}/quotes`}
                >
                  <a>
                    <IconContainer>
                      <MdAssignmentInd />
                      <p>My Quotes</p>
                    </IconContainer>
                  </a>
                </Link>
                <Link href="/quotes/new">
                  <a>
                    <IconContainer>
                      <MdNoteAdd />
                      <p>New</p>
                    </IconContainer>
                  </a>
                </Link>
              </>
            )}
            {!user ? (
              <Link href="/signin">
                <a>
                  <IconContainer>
                    <IoMdLogIn />
                    <p>Sign In</p>
                  </IconContainer>
                </a>
              </Link>
            ) : (
              <Logout>
                <IconContainer>
                  <IoMdLogOut />
                  <p>Log out</p>
                </IconContainer>
              </Logout>
            )}
          </ul>
        </NavbarStyles>
      )}
    </AuthContext.Consumer>
  );
};
