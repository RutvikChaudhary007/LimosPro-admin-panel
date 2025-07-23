import type { ReactNode } from "react";

interface IHeaderProps {
  children: ReactNode;
}

const Header: React.FC<IHeaderProps> = ({children, ...props}) => {
  
  return (
    <header {...props}>
      {children}
    </header>
  );
};

export default Header;
