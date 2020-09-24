import React from "react";
import RingLoader from "react-spinners/RingLoader";
import { ThemeConsumer } from "styled-components";

export const PageLoader: React.FC = () => {
  return (
    <ThemeConsumer>
      {(theme) => <RingLoader color={theme.pageloader} size={50} />}
    </ThemeConsumer>
  );
};
