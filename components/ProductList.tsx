import Product from "../types/Product";
import React from "react";
import styled from "styled-components";

interface ProductListProps {
  products: Product[];
  onProductAdd: (Product) => void;
}

const ProductStyles = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ProductName = styled.h3`
  flex: 1 1 300px;
`;

const Price = styled.span``;

export default function ProductList({
  products,
  onProductAdd,
}: ProductListProps) {
  return (
    <div>
      {products.map((product) => (
        <ProductStyles key={product.sku}>
          <ProductName>{product.name}</ProductName>
          <Price>{product.price}</Price>
          <button onClick={() => onProductAdd(product)}>Add to basket</button>
        </ProductStyles>
      ))}
    </div>
  );
}
