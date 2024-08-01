"use client";

import { useEffect } from "react";
import useBasket from "../../../features/basket/useBasket";

export default function CheckOutSuccess() {
  const { clearBasket } = useBasket();

  useEffect(() => {
    clearBasket();
  }, []);

  return <h1>Thank you, your order is being processed</h1>;
}
