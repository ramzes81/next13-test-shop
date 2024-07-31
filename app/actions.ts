"use server";

import { API_ROUTES, generateApiURL } from "../lib/api";
import PromoDiscount from "../types/PromoDiscount";
import { ApiResponse } from "../types/api";

export async function validatePromocode(
  promocode: string,
): Promise<PromoDiscount> {
  if (!promocode) {
    throw Error("No promocode provided!");
  }

  const response = await fetch(generateApiURL(API_ROUTES.PROMOCODE), {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ promoCode: promocode }),
    // it's POST, but actually can be cached in this very situation
    // in real-life scenario would not be cacheable
    cache: "force-cache",
  });

  const promoDiscountResponse =
    (await response.json()) as ApiResponse<PromoDiscount>;

  if (response.ok) {
    return await response.json();
  } else if ("errors" in promoDiscountResponse) {
    throw new Error(promoDiscountResponse.errors.map((e) => e.msg).join("\n"));
  } else {
    throw new Error("Something went wrong, try again later!");
  }
}
