import React, { useContext } from "react";
import { Quotes } from "../../components/Quotes";
import { useRouter } from "next/router";
import { AuthContext } from "../../components/Auth";

const UserPage: React.FC = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { slug, tag } = router.query;

  let submittedBy;

  let likedBy;

  if (user && user.username === slug[0]) {
    submittedBy = user.id;
    likedBy = user.id;
  } else {
    router.push("/quotes");
  }

  return (
    <div>
      {slug[1] === "quotes" && (
        <Quotes tag={tag as string} limit={4} submittedBy={submittedBy} />
      )}
      {slug[1] === "likes" && (
        <Quotes tag={tag as string} limit={4} likedBy={likedBy} />
      )}
    </div>
  );
};

export default UserPage;
