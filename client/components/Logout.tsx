import { useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import { AuthContext } from "./Auth";

const LOGOUT_MUTATION = gql`
  mutation LOGOUT_MUTATION {
    logout {
      message
    }
  }
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
    <button type="button" onClick={logoutUser}>
      Logout
    </button>
  );
};
