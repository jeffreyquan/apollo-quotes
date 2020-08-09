import { useRouter } from "next/router";
import { SingleQuote } from "../../components/SingleQuote";

const SingleQuotePage = () => {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <div>
      <SingleQuote slug={slug as string} />
    </div>
  );
};

export default SingleQuotePage;
