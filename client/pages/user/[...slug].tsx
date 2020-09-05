import { useContext } from "react";
import { Quotes } from "../../components/Quotes";
import { useRouter } from "next/router";
import { AuthContext } from "../../components/Auth";

const UserPage = () => {
  const router = useRouter();
  let { user } = useContext(AuthContext);
  const { slug, tag } = router.query;

  let submittedBy;

  if (user && user.username === slug[0]) {
    submittedBy = user.id;
  }

  return (
    <div>
      {slug[1] === "quotes" && (
        <Quotes tag={tag as string} limit={4} submittedBy={submittedBy} />
      )}
    </div>
  );
};

export default UserPage;
