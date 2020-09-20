import RingLoader from "react-spinners/RingLoader";
import { ThemeConsumer } from "styled-components";

export const PageLoader = (props) => {
  return (
    <ThemeConsumer>
      {(theme) => <RingLoader {...props} color={theme.loader} size={50} />}
    </ThemeConsumer>
  );
};
