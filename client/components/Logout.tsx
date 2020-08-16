import { useContext } from "react";
import styled from "styled-components";
import { gql, useMutation } from "@apollo/client";
import { AuthContext } from "./Auth";

const LOGOUT_MUTATION = gql`
  mutation LOGOUT_MUTATION {
    logout {
      message
    }
  }
`;

const LogoutButton = styled.button`
  cursor: pointer;
  outline: none;
  border: none;
  background-color: inherit;
  font-size: 2rem;
  color: ${(props) => props.theme.headline2};
  padding: 2rem 1rem;
`;

export const Logout = () => {
  const [logout] = useMutation(LOGOUT_MUTATION);

  let { setUser } = useContext(AuthContext);

  const logoutUser = async () => {
    const res = await logout();
    if (res.data.logout.message) {
      setUser(null);
    }
  };

  return (
    <LogoutButton type="button" onClick={logoutUser}>
      Logout
    </LogoutButton>
  );
};
