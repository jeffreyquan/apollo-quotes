import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";

const CURRENT_USER_QUERY = gql`
  query {
    userProfile {
      id
      name
      username
      email
    }
  }
`;

export const useUser = () => {
  const { data, loading, error } = useQuery(CURRENT_USER_QUERY);

  if (data) {
    return data.userProfile;
  }
};

export const AuthContext = React.createContext({
  checkingAuth: true,
  user: null,
  setUser: null,
});

export const AuthProvider = ({ children }) => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);

  const { data, loading, error } = useQuery(CURRENT_USER_QUERY);

  useEffect(() => {
    if (typeof data === undefined) {
      setCheckingAuth(true);
    } else if (data) {
      setUser(data.userProfile);
      setCheckingAuth(false);
    } else {
      setCheckingAuth(false);
    }
  }, [data]);

  const value = { checkingAuth, user, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
