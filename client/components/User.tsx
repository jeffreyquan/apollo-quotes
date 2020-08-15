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

export const User = () => {
  const { data, loading, error } = useQuery(CURRENT_USER_QUERY);

  if (error) return null;

  if (data) {
    return data.userProfile;
  }
};
