import React, { useCallback, useMemo, useState } from "react";
import Product from "../../types/Product";
import usePersistedState from "@utilityjs/use-persisted-state";

type BasketState = Record<number, BasketProduct>;

export interface BasketContextValue {
  basket: BasketState;
  totalQuantity: number;
  totalSum: number;
  addToBasket: (Product) => void;
  changeQuantity: (sku: number, quantity: number) => void;
}

interface BasketProduct extends Product {
  quantity: number;
}

export const BasketContext = React.createContext<
  BasketContextValue | undefined
>(undefined);

export default function BasketContextProvider({ children }) {
  const [basket = {}, setBasket] = usePersistedState<BasketState>(
    {},
    { name: "basket" },
  );

  const addToBasket = useCallback(
    (product: Product) => {
      const basketProduct = basket[product.sku] ?? { ...product, quantity: 0 };
      basketProduct.quantity++;

      setBasket({
        ...basket,
        [basketProduct.sku]: basketProduct,
      });
    },
    [basket],
  );

  const totalQuantity = useMemo(() => {
    return Object.entries(basket).reduce(
      (result, [, product]) => result + product.quantity,
      0,
    );
  }, [basket]);

  const totalSum = useMemo(() => {
    return Object.entries(basket).reduce(
      (result, [, product]) => result + product.price * product.quantity,
      0,
    );
  }, [basket]);

  const changeQuantity = useCallback((sku: number, quantity: number) => {
    const basketProduct = basket[sku];
    if (!basketProduct) {
      throw new Error("There is no such product in the basket!");
    }
    if (quantity < 0 || quantity > 10) {
      throw new Error("Quantity must be 0 - 10");
    }
    basketProduct.quantity = quantity;

    setBasket({
      ...basket,
      [basketProduct.sku]: basketProduct,
    });
  }, []);

  const value: BasketContextValue = useMemo(
    () => ({
      basket,
      addToBasket,
      totalQuantity,
      totalSum,
      changeQuantity,
    }),
    [basket],
  );

  return (
    <BasketContext.Provider value={value}>{children}</BasketContext.Provider>
  );
}
