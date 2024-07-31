"use client";

import { ReactNode } from "react";
import BasketContextProvider from "../features/basket/BasketContext";
import StyledComponentsStylesRegistry from "./StyledComponentsStylesRegistry";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BasketContextProvider>
      <StyledComponentsStylesRegistry>
        {children}
      </StyledComponentsStylesRegistry>
    </BasketContextProvider>
  );
}
