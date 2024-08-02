"use client";

import { ReactNode } from "react";
import { ChakraProvider } from "@chakra-ui/react";

import BasketContextProvider from "../features/basket/BasketContext";
import { theme } from "./theme";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BasketContextProvider>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </BasketContextProvider>
  );
}
