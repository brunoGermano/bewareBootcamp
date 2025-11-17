"use server"; // Transform this in a "server action" which will run on the server side
// This code file will create an action that will cause a change triggered by the client to be reflected in the shopping cart on the server.

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import z from "zod";

import { db } from "@/db";
import { cartItemTable, cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { removeProductFromCartSchema  } from "./schema";

// it will define this file being a SERVER ACTION an it will be an API route from client to the server when the "adicionar a sacola" button is pressed.
export const removeProductFromCart = async (data: z.infer<typeof removeProductFromCartSchema>) => {
    
  // Needded to make validations here. So It is used "AddProductToCartSchema" to verify is "uuid" is valid and the "quantity" is a number with at least the value "1", both them defined in the interface "AddProductToCartSchema".

  // Verifying if the data is valid, if not that "parse" function will throw an exception.
  removeProductFromCartSchema.parse(data);



  // Verifying if the user is LOGGED using "session" variable to Validate session user from Better Auth
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }


  // 3) Here it Verifies which item from cart correspond to this product variant that we received from our server action.
  const cartItem = await db.query.cartItemTable.findFirst({
    where: (cartItem, { eq }) => eq(cartItem.id, data.cartItemId),
    with: {  // recover the "cart" together with "cartItem"
        cart: true,
    },
  });

  // Verifies If this "cart" doesn't allow to the user logged, it can not delete de item from this "cart"
  const cartDoesNotBelongToUser = cartItem?.cart.userId !== session.user.id;
  if(cartDoesNotBelongToUser){
    throw new Error("Unauthorized");
  }


    // 4) Attention, despite your interface doesn't allow this server action be called when you click on the trash icon.
    /*
        You MUST take all the cares to avoid errors, It's because a server action is a COMMON ROUTE HTTP so someone 
        out of your front end interface can call it using other ways instead clicking on the "trash icon" 
        from your interface, just typing the way on the HTTP bar on the top of the browser. Remember it!
    */ 
  if (!cartItem) {
    throw new Error("Cart item not found.");
  }


  // 5) if the code reached this point, it means that you have a CART ITEM to be removed and then this item must be deleted.
  await db.delete(cartItemTable).where(eq(cartItemTable.id, cartItem.id));

};
