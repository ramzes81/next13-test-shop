import { API_ROUTES, generateApiURL } from "../../lib/api";
import ProductsScreen from "../../screens/products/ProductsScreen";
import Product from "../../types/Product";

export default async function ProductsPage() {
  const productsResponse = await fetch(generateApiURL(API_ROUTES.PRODUCTS));

  if (!productsResponse.ok) {
    throw new Error("Products fetch failed");
  }

  const products = (await productsResponse.json()) as Product[];

  return <ProductsScreen products={products} />;
}
