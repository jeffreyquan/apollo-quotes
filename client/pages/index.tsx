import { Quotes } from "../components/Quotes";

const HomePage = (props) => {
  return (
    <div>
      <Quotes limit={4} />
    </div>
  );
};

export default HomePage;
