import { BasketContext } from "./BasketContext";
import { useContext } from "react";

export default function useBasket() {
  const context = useContext(BasketContext);
  if (context === undefined) {
    throw new Error("useBasket must be used within a BasketContext");
  }
  return context;
}
