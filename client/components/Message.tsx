import styled, { css } from "styled-components";

const MessageStyles = styled.div`
  position: absolute;
  top: 9rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.4rem;
  padding: 2rem;

  ${(props) =>
    props.error &&
    css`
      border: 1px solid red;
      border-radius: 4px;
    `}
`;

export const Message = ({ children, ...props }) => {
  return <MessageStyles {...props}>{children}</MessageStyles>;
};
