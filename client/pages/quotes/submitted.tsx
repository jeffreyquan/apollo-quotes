import { useContext } from "react";
import { Quotes } from "../../components/Quotes";
import { useRouter } from "next/router";
import { AuthContext } from "../../components/Auth";

const QuotesSubmittedPage = (props) => {
  const router = useRouter();
  let { user } = useContext(AuthContext);
  const { tag } = router.query;

  let submittedBy;

  if (user) {
    submittedBy = user.id;
  } else {
    router.push({
      pathname: "/",
    });
  }

  return (
    <div>
      <Quotes tag={tag as string} limit={4} submittedBy={submittedBy} />
    </div>
  );
};

export default QuotesSubmittedPage;
