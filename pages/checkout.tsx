import React, { useEffect, useMemo, useState } from "react";
import useBasket from "../features/basket/useBasket";
import styled from "styled-components";
import useSWR, { Key } from "swr";
import { useRouter } from "next/router";
import usePersistedState from "@utilityjs/use-persisted-state";

const ProductStyles = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ProductName = styled.h3`
  flex: 1 1 300px;
`;

const Price = styled.span``;

interface PromocodeResponse {
  discounttype: "percent";
  amount: number;
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

  const [appliedPromo, setAppliedPromo] = usePersistedState("", {
    name: "appliedPromocode",
  });

  const { data: validatedPromoCode, error } = useSWR<PromocodeResponse>(
    appliedPromo ? ["/api/promocode", appliedPromo] : null,
    (url, appliedPromo) =>
      fetch<PromocodeResponse>(url, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ promoCode: appliedPromo }),
      }),
    { revalidateOnFocus: false },
  );

  const totalSumWithPromo = useMemo(
    () =>
      validatedPromoCode
        ? totalSum * ((100 - validatedPromoCode.amount) / 100)
        : totalSum,
    [totalSum, validatedPromoCode],
  );

  const [checkOutTimestamp, setCheckOutTimestamp] = useState(0);

  const { data: checkOutResult, error: checkOutError } =
    useSWR<CheckoutResponse>(
      checkOutTimestamp ? ["/api/checkout", checkOutTimestamp] : null,
      (url) =>
        fetch<CheckoutResponse>(url, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            basket: Object.values(basket),
            cardNumber: creditCardInput,
          }),
        }),
      { revalidateOnFocus: false },
    );

  const router = useRouter();

  useEffect(() => {
    if (checkOutResult) {
      if (checkOutResult.msg) {
        router.push("/checkout_success");
      }
      if (checkOutResult.errors) {
        router.push("/checkout_failure");
      }
    }
    if (checkOutError) {
      router.push("/checkout_failure");
    }
  }, [checkOutResult, checkOutError]);

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
            onChange={(e) => setUserPromoInput(e.target.value)}
          />
        </label>
        <input
          type="button"
          value="Apply Promo Code"
          onClick={() => setAppliedPromo(promoUserInput)}
        />
      </div>
      <div>Sub Total : {totalSum?.toFixed(2)}</div>
      {validatedPromoCode && (
        <div>Promotional Discount Amount: {validatedPromoCode.amount}</div>
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
