import { API_URL } from "./constants";

export enum API_ROUTES {
  PRODUCTS = "/products",
  CHECKOUT = "/checkout",
  PROMOCODE = "/promocode",
}

export function generateApiURL(route: API_ROUTES) {
  return `${API_URL}${route}`;
}
