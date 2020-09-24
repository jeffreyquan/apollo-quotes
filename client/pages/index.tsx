import { NextPage } from "next";
import { useRouter } from "next/router";
import { PageLoader } from "../components/PageLoader";

const HomePage: NextPage = () => {
  const router = useRouter();
  router.push("/quotes");
  return (
    <div>
      <PageLoader />
    </div>
  );
};

export default HomePage;
