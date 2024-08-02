"use client";

import Product from "../../types/Product";
import useBasket from "../../features/basket/useBasket";
import ProductList from "../../components/ProductList";
import Link from "next/link";
import React from "react";

export default function ProductsScreen({ products }: { products: Product[] }) {
  const { addToBasket } = useBasket();

  return (
    <div>
      <ProductList products={products} onProductAdd={addToBasket} />
      <Link href="/checkout">Proceed to checkout</Link>
    </div>
  );
}
