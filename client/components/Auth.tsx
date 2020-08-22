import { createContext, useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";

const CURRENT_USER_QUERY = gql`
  query {
    userProfile {
      id
      name
      username
      email
      role
    }
  }
`;

const initialAuthState = {
  checkingAuth: true,
  user: null,
  setUser: null,
};

export const AuthContext = createContext(initialAuthState);

export const AuthProvider = ({ children }) => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);

  const { data, loading, error } = useQuery(CURRENT_USER_QUERY);

  useEffect(() => {
    if (error) {
      setUser(null);
      setCheckingAuth(false);
    } else if (typeof data !== undefined) {
      setCheckingAuth(false);
      if (data) {
        setUser(data.userProfile);
      }
    }
  }, [error, data]);

  const value = { checkingAuth, user, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
