import { useQuery, gql } from "@apollo/client";

export const CURRENT_USER_QUERY = gql`
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
