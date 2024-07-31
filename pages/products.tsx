import React from "react";
import useSWR from "swr";
import fetch from "../util/fetch";
import Product from "../types/Product";
import Header from "../components/Header";
import ProductList from "../components/ProductList";
import useBasket from "../features/basket/useBasket";
import Link from "next/link";

export default function Products() {
  const { data, error } = useSWR<Product[]>("/api/products", fetch);

  const { addToBasket } = useBasket();

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <div>
      <Header />
      <ProductList products={data} onProductAdd={addToBasket} />
      <Link href="/checkout">Proceed to checkout</Link>
    </div>
  );
}
