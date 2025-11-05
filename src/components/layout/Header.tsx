import type { ReactNode } from "react"

interface IHeaderProps {
  children: ReactNode
  className: string
}

const Header: React.FC<IHeaderProps> = ({ children, ...props }: IHeaderProps) => {
  return <header {...props}>{children}</header>
}

export default Header
