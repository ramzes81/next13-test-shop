"use server";

import { API_ROUTES, generateApiURL } from "../lib/api";
import PromoDiscount from "../types/PromoDiscount";

export async function validatePromocode(
  promocode: string,
): Promise<PromoDiscount> {
  if (!promocode) {
    //TODO: do some validation
  }

  const response = await fetch(generateApiURL(API_ROUTES.PROMOCODE), {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ promoCode: promocode }),
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw Error(`Promo code ${promocode} is invalid`);
  }
}
