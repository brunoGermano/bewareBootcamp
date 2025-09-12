"use client";

import { useQuery } from "@tanstack/react-query";
import { ShoppingBasketIcon } from "lucide-react";
import Image from "next/image";

import { getCart } from "@/actions/get-cart";

import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import CartItem from "./cart-item";

const Cart = () => {
  // Using the react-query here, uses like a father on the layout.tsx from app folder
  // A query is a call that obtain datas
  const { data: cart, isPending: cartIsLoading } = useQuery({
    queryKey: ["cart"],

    // "queryFn" is a function that fetch the datas from the cart. Since a "serverAction" is a kind of HTTP route accssing an API, so It is possible call "getCart()" here because it is a "serverAction".
    queryFn: () => getCart(),
  });
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <ShoppingBasketIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        {/* parou aqui 01:08:11 */}
        <SheetHeader>
          <SheetTitle>Carrinho</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 px-5">
          {cartIsLoading && <div>Carregando...</div>}
          {cart?.items.map((item) => (
            <CartItem
              key={item.id}
              id={item.id}
              productName={item.productVariant.product.name}
              productVariantName={item.productVariant.name}
              productVariantImageUrl={item.productVariant.imageUrl}
              productVariantPriceInCents={item.productVariant.priceInCents}
              quantity={item.quantity}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;

// A server action is provided by Next.js, it creates an API route which is a function that will be executed on server side. And on the server side it is possible access server resources like data base, sensitive credentials and so on, which, in other hand, wouldn't be acessible on the client side.
