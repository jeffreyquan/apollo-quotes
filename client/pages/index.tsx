import Head from "next/head";
import { Quotes } from "../components/Quotes";

const HomePage = (props) => (
  <div>
    <Quotes limit={4} />
  </div>
);

export default HomePage;
