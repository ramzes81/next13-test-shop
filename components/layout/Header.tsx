"use client";

import useBasket from "../../features/basket/useBasket";
import React from "react";
import { Box } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const { totalQuantity } = useBasket();
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      paddingBlock={4}
      paddingInline={2}
    >
      <div>{children}</div>
      <Link href="/checkout">Basket ({totalQuantity})</Link>
    </Box>
  );
}
