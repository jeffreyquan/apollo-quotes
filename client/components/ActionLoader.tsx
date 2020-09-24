import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { ThemeConsumer } from "styled-components";

export const ActionLoader: React.FC = () => {
  return (
    <ThemeConsumer>
      {(theme) => <ClipLoader color={theme.actionloader} size={20} />}
    </ThemeConsumer>
  );
};
