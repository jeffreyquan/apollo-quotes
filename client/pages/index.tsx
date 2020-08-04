import Head from "next/head";
import Quotes from "../components/Quotes";

const Home = (props) => (
  <div>
    <Quotes limit={4} />
  </div>
);

export default Home;
