import { useRouter } from "next/router";
import { SingleQuote } from "../../components/SingleQuote";
import { UpdateQuote } from "../../components/UpdateQuote";

const SingleQuotePage = () => {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <div>
      {slug[1] && slug[1] === "edit" ? (
        <UpdateQuote slug={slug[0] as string} />
      ) : (
        <SingleQuote slug={slug[0] as string} />
      )}
    </div>
  );
};

export default SingleQuotePage;
