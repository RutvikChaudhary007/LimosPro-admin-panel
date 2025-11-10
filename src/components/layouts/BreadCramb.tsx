import type { ReactNode } from "react";

interface IHeaderProps {
  children: ReactNode;
  className: string;
}

const BreadCramb: React.FC<IHeaderProps> = ({ children, ...props }) => {
  return <header {...props}>{children}</header>;
};

export default BreadCramb;
