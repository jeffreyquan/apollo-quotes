import { NextPage } from "next";
import { Quotes } from "../components/Quotes";
import { useRouter } from "next/router";

const QuotesPage: NextPage = () => {
  const router = useRouter();
  const { tag } = router.query;

  return (
    <div>
      <Quotes tag={tag as string} limit={4} />
    </div>
  );
};

export default QuotesPage;
