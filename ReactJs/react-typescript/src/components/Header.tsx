import { ReactNode } from "react"

interface HeaderDefination{
  image: {
    src: string,
    alt: string
  };
  children: ReactNode;
  
}

export default function Header({image,children}:HeaderDefination) {
  return (
    <header>
      <img {...image} />
      {children}
    </header>
  )
}