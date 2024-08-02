import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";

import Product from "../types/Product";

interface ProductListProps {
  products: Product[];
  onProductAdd: (Product) => void;
}

export default function ProductList({
  products,
  onProductAdd,
}: ProductListProps) {
  return (
    <SimpleGrid
      spacing={4}
      templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
    >
      {products.map((product) => (
        <Card key={product.sku}>
          <CardHeader>
            <Heading size="md">{product.name}</Heading>
          </CardHeader>
          <CardBody>
            <Text color="blue.600" fontSize="2xl">
              ${product.price}
            </Text>
          </CardBody>
          <Divider />
          <CardFooter>
            <Button
              variant="solid"
              colorScheme="blue"
              size="sm"
              onClick={() => onProductAdd(product)}
            >
              Add to basket
            </Button>
          </CardFooter>
        </Card>
      ))}
    </SimpleGrid>
  );
}
