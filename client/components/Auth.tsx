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

export const AuthContext = createContext({
  checkingAuth: true,
  user: null,
  setUser: null,
});

export const AuthProvider = ({ children }) => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);

  const { data, loading, error } = useQuery(CURRENT_USER_QUERY);

  useEffect(() => {
    if (typeof data !== undefined) {
      setCheckingAuth(false);
      if (data) {
        setUser(data.userProfile);
      }
    }
  }, [data]);

  const value = { checkingAuth, user, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
