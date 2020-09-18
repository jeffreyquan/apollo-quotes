import styled, { css } from "styled-components";

const MessageStyles = styled.div`
  top: 9rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.4rem;
  padding: 2rem;
  margin: 2rem 0;
  border: 1px solid transparent;

  ${(props) =>
    props.error &&
    css`
      border: 1px solid ${(props) => props.theme.btnbg};
      border-radius: 4px;
    `}
`;

export const Message = ({ children, ...props }) => {
  return <MessageStyles {...props}>{children}</MessageStyles>;
};
