import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../../components/Auth";
import { QuoteNew } from "../../components/QuoteNew";
import { useUser } from "../../components/User";

const NewQuotePage = () => {
  const [loadingPage, setLoadingPage] = useState(true);
  let { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    console.log(user);
    if (!user) {
      router.push({
        pathname: "/login",
        query: { redirect: "true" },
      });
    } else {
      setLoadingPage(false);
    }
  }, [user]);

  return !loadingPage ? <QuoteNew /> : <div>Loading...</div>;
};

export default NewQuotePage;
