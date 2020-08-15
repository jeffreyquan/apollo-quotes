import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { QuoteNew } from "../../components/QuoteNew";
import { useUser } from "../../components/User";

const NewQuotePage = () => {
  const user = useUser();
  const router = useRouter();

  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      if (!user) {
        console.log("redirecting...");
        router.push("/login");
      }
    } else {
      isMounted.current = true;
    }
  }, [user]);

  return (
    <div>
      <QuoteNew />
    </div>
  );
};

export default NewQuotePage;
