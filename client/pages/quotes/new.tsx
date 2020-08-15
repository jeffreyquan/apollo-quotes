import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { QuoteNew } from "../../components/QuoteNew";
import { useUser } from "../../components/User";

const NewQuotePage = () => {
  const [loadingPage, setLoadingPage] = useState(true);
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
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
