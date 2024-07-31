"use client";

import React, { useMemo, useState } from "react";
import useBasket from "../../features/basket/useBasket";
import styled from "styled-components";
import usePersistedState from "@utilityjs/use-persisted-state";
import PromoDiscount from "../../types/PromoDiscount";
import { validatePromocode } from "../actions";

const ProductStyles = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ProductName = styled.h3`
  flex: 1 1 300px;
`;

const Price = styled.span``;

interface AppliedPromocode {
  discount: PromoDiscount;
  promocode: string;
}

interface CheckoutResponseSuccess {
  msg: string;
}

interface CheckoutResponseError {
  errors: { field: string; msg: string }[];
}

type CheckoutResponse = CheckoutResponseSuccess & CheckoutResponseError;

export default function Checkout() {
  const { basket, totalSum, changeQuantity } = useBasket();

  const [creditCardInput, setCreditCardInput] = useState("");
  const [promoUserInput, setUserPromoInput] = useState("");

  const [appliedPromo, setAppliedPromo] =
    usePersistedState<AppliedPromocode | null>(null, {
      name: "appliedPromocode",
    });
  const [promocodeFormError, setPromocodeFormError] = useState<string | null>(
    null,
  );

  const totalSumWithPromo = useMemo(
    () =>
      appliedPromo
        ? totalSum * ((100 - appliedPromo.discount.amount) / 100)
        : totalSum,
    [totalSum, appliedPromo],
  );

  const [checkOutTimestamp, setCheckOutTimestamp] = useState(0);

  // const { data: checkOutResult, error: checkOutError } =
  //   useSWR<CheckoutResponse>(
  //     checkOutTimestamp ? ["/api/checkout", checkOutTimestamp] : null,
  //     (url) =>
  //       fetch<CheckoutResponse>(url, {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         method: "POST",
  //         body: JSON.stringify({
  //           basket: Object.values(basket),
  //           cardNumber: creditCardInput,
  //         }),
  //       }),
  //     { revalidateOnFocus: false },
  //   );

  // useEffect(() => {
  //   if (checkOutResult) {
  //     if (checkOutResult.msg) {
  //       router.push("/checkout_success");
  //     }
  //     if (checkOutResult.errors) {
  //       router.push("/checkout_failure");
  //     }
  //   }
  //   if (checkOutError) {
  //     router.push("/checkout_failure");
  //   }
  // }, [checkOutResult, checkOutError]);

  return (
    <div>
      <h1>Checkout</h1>
      {Object.entries(basket || {}).map(([, product]) => (
        <ProductStyles key={product.sku}>
          <ProductName>{product.name}</ProductName>
          <input
            type="number"
            value={product.quantity}
            onChange={(e) => changeQuantity(product.sku, +e.target.value)}
            min={0}
          />
        </ProductStyles>
      ))}
      <div>
        <label>
          Enter Promo Code
          <input
            type="text"
            value={promoUserInput}
            onChange={(e) => {
              setPromocodeFormError(null);
              setUserPromoInput(e.target.value);
            }}
          />
          {promocodeFormError && <span>{promocodeFormError}</span>}
        </label>
        <input
          type="button"
          value="Apply Promo Code"
          disabled={!!promocodeFormError}
          onClick={async (event) => {
            try {
              const validatedPromoDiscount =
                await validatePromocode(promoUserInput);
              setAppliedPromo({
                discount: validatedPromoDiscount,
                promocode: promoUserInput,
              });
              setUserPromoInput("");
            } catch (e) {
              setPromocodeFormError(e.message);
            }
          }}
        />
      </div>
      <div>Sub Total : {totalSum?.toFixed(2)}</div>
      {appliedPromo && (
        <div>
          Promotional Discount Amount: {appliedPromo.promocode} -{" "}
          {appliedPromo.discount.amount} %
        </div>
      )}
      <div>Basket Total: {totalSumWithPromo?.toFixed(2)}</div>
      <div>
        <label>
          Please enter your credit card number
          <input
            type="text"
            value={creditCardInput}
            onChange={(e) => setCreditCardInput(e.target.value)}
          />
        </label>
        <input
          type="button"
          value="Checkout"
          onClick={() => setCheckOutTimestamp(new Date().getTime())}
        />
      </div>
    </div>
  );
}
