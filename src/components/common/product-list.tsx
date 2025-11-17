"use client";

import { productTable, productVariantTable } from "@/db/schema";

import ProductItem from "./product-item";

// Creates an interface that will define types for the list of props which this component will receive
interface ProductListProps {
  title: string;
  products: (typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  })[]; // It is an array where Each object has your properties and a list of your own variants
}
// Props are used to reuse components and receive dynamics datas on them
const ProductList = ({ title, products }: ProductListProps) => {
  return (
    <div className="space-y-6">
      <h3 className="px-5 font-semibold">{title}</h3>
      <div className="flex w-full gap-4 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
