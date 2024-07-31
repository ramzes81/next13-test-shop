import Link from "next/link";
import styled from "styled-components";
import useBasket from "../features/basket/useBasket";
import React from "react";

interface HeaderProps {
  children?: React.ReactNode;
}

const HeaderStyles = styled.header`
  display: flex;
  flex-direction: row;
`;

export default function Header({ children }: HeaderProps) {
  const { totalQuantity } = useBasket();
  return (
    <HeaderStyles>
      {children}
      <Link href="/checkout">Basket ({totalQuantity})</Link>
    </HeaderStyles>
  );
}
