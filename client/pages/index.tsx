import { useRouter } from "next/router";

const HomePage = (props) => {
  const router = useRouter();
  router.push("/quotes");
  return <div>Loading...</div>;
};

export default HomePage;
