import styled from "styled-components";

const MessageStyles = styled.div`
  height: 2.4rem;
`;

export const Message = ({ children }) => {
  return <MessageStyles>{children}</MessageStyles>;
};
