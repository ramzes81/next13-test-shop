"use client";

import React, { useMemo, useState } from "react";
import useBasket from "../../features/basket/useBasket";
import usePersistedState from "@utilityjs/use-persisted-state";
import PromoDiscount from "../../types/PromoDiscount";
import { checkout, validatePromocode } from "../actions";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Input,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import NumberInput from "../../components/inputs/NumberInput";

interface AppliedPromocode {
  discount: PromoDiscount;
  promocode: string;
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
      <Heading>Checkout</Heading>
      <form action={checkout}>
        <Card>
          <CardBody>
            <List spacing={2}>
              {Object.entries(basket || {}).map(([, product], index) => (
                <ListItem
                  key={product.sku}
                  display="flex"
                  justifyContent="space-between"
                >
                  <Text>{product.name}</Text>
                  <input
                    type="hidden"
                    name={`basket[${index}].sku`}
                    value={product.sku}
                  />
                  <NumberInput
                    name={`basket[${index}].quantity`}
                    value={product.quantity}
                    onChange={(_, valueAsNumber) =>
                      changeQuantity(product.sku, valueAsNumber)
                    }
                  />
                </ListItem>
              ))}
            </List>
            <div>
              <input
                type="hidden"
                name="promocode"
                value={appliedPromo?.promocode}
              />
              <Input
                type="text"
                value={promoUserInput}
                onChange={(e) => {
                  setPromocodeFormError(null);
                  setUserPromoInput(e.target.value);
                }}
                placeholder="Enter Promo Code"
              />
              {promocodeFormError && <span>{promocodeFormError}</span>}
              <Button
                variant="solid"
                colorScheme="blue"
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
              >
                Apply Promo Code
              </Button>
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
              <Input
                type="text"
                name="cardNumber"
                placeholder="Please enter your credit card number"
                value={creditCardInput}
                onChange={(e) => setCreditCardInput(e.target.value)}
              />
            </div>
          </CardBody>
          <Divider />
          <CardFooter justify="end">
            <Button variant="solid" colorScheme="blue" type="submit">
              Checkout
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
