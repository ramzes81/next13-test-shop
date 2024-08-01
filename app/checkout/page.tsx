"use client";

import React, { useMemo, useState } from "react";
import useBasket from "../../features/basket/useBasket";
import styled from "styled-components";
import usePersistedState from "@utilityjs/use-persisted-state";
import PromoDiscount from "../../types/PromoDiscount";
import { checkout, validatePromocode } from "../actions";

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

  return (
    <div>
      <form action={checkout}>
        <h1>Checkout</h1>
        {Object.entries(basket || {}).map(([, product], index) => (
          <ProductStyles key={product.sku}>
            <ProductName>{product.name}</ProductName>
            <input
              type="hidden"
              name={`basket[${index}].sku`}
              value={product.sku}
            />
            <input
              type="number"
              name={`basket[${index}].quantity`}
              value={product.quantity}
              onChange={(e) => changeQuantity(product.sku, +e.target.value)}
              min={0}
            />
          </ProductStyles>
        ))}
        <div>
          <input
            type="hidden"
            name="promocode"
            value={appliedPromo?.promocode}
          />
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
            onClick={async () => {
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
              name="cardNumber"
              value={creditCardInput}
              onChange={(e) => setCreditCardInput(e.target.value)}
            />
          </label>
          <input type="submit" value="Checkout" />
        </div>
      </form>
    </div>
  );
}
