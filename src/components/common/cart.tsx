"use client";

import { ShoppingBasketIcon } from "lucide-react";

import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

const Cart = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <ShoppingBasketIcon />
        </Button>
      </SheetTrigger>
      <SheetContent></SheetContent>
    </Sheet>
  );
};

export default Cart;

// A server action is provided by Next.js, it creates an API route which is a function that will be executed on server side. And on the server side it is possible access server resources like data base, sensitive credentials and so on, which, in other hand, wouldn't be acessible on the client side.
