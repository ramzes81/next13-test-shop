"use server";

import { API_ROUTES, generateApiURL } from "../lib/api";
import PromoDiscount from "../types/PromoDiscount";
import { ApiResponse } from "../types/api";
import { formDataToObject } from "formdata2json";
import { redirect } from "next/navigation";

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

export async function checkout(formData: FormData) {
  const submittedDataObject = formDataToObject(formData);
  const processedSubmittedDataObject = {
    ...submittedDataObject,
    // mocked BE expects string here...
    cardNumber: submittedDataObject.cardNumber?.toString(),
  };

  const response = await fetch(generateApiURL(API_ROUTES.CHECKOUT), {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(processedSubmittedDataObject),
  });

  if (response.ok) {
    redirect("/checkout/success");
  } else {
    redirect("/checkout/failure");
  }
}
