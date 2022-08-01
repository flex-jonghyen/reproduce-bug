import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const Div = ({ children }: Props) => {
  return <div>{children}</div>;
};
