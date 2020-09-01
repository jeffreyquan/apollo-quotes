import { useEffect, useRef, useState, useContext } from "react";
import { Quotes } from "../../components/Quotes";
import { useRouter } from "next/router";
import { AuthContext } from "../../components/Auth";

const UserPage = () => {
  const router = useRouter();
  let { user } = useContext(AuthContext);
  const { username, quotes, tag } = router.query;

  let submittedBy;

  if (user && user.username === username) {
    submittedBy = user.id;
  } else {
    router.push({
      pathname: "/",
    });
  }

  return (
    <div>
      {quotes === "submitted" && (
        <Quotes tag={tag as string} limit={4} submittedBy={submittedBy} />
      )}
    </div>
  );
};

export default UserPage;
