"use server"; // Transform this in a "server action" which will run on the server side
// This code file will create an action that will cause a change triggered by the client to be reflected in the shopping cart on the server.

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import z from "zod";

import { db } from "@/db";
import { cartItemTable, cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { DecreaseCartProductQuantitySchema, decreaseCartProductQuantitySchema  } from "./schema";

// it will define this file being a SERVER ACTION an it will be an API route from client to the server when the "adicionar a sacola" button is pressed.
export const decreaseCartProductQuantity = async (data: DecreaseCartProductQuantitySchema ) => {
    
  // Needded to make validations here. So It is used "AddProductToCartSchema" to verify is "uuid" is valid and the "quantity" is a number with at least the value "1", both them defined in the interface "AddProductToCartSchema".

  // Verifying if the data is valid, if not that "parse" function will throw an exception.
  decreaseCartProductQuantitySchema.parse(data);



  // Verifying if the user is LOGGED using "session" variable to Validate session user from Better Auth
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }


  // Here it Verifies which item from cart correspond to this product variant that we received from our server action.
  const cartItem = await db.query.cartItemTable.findFirst({
    where: (cartItem, { eq }) => eq(cartItem.id, data.cartItemId),
    with: {  // recover the "cart" together with "cartItem"
        cart: true,
    },
  });

  
    // Attention, despite your interface doesn't allow this server action be called when you click on the trash icon.
    /*
        You MUST take all the cares to avoid errors, It's because a server action is a COMMON ROUTE HTTP so someone 
        out of your front end interface can call it using other ways instead clicking on the "trash icon" 
        from your interface, just typing the way on the HTTP bar on the top of the browser. Remember it!
    */ 
    if (!cartItem) {
      throw new Error("Cart item not found.");
    }

    // Verifies If this "cart" doesn't allow to the user logged, it can not delete de item from this "cart"
  const cartDoesNotBelongToUser = cartItem?.cart.userId !== session.user.id;
  if(cartDoesNotBelongToUser){
    throw new Error("Unauthorized");
  }

  // If quantity equal to 1, It is necessary remove it from cart because it will be 0.
  if(cartItem.quantity === 1){
    // If the code reached this point, it means that you have only 1 item in the cart and you should delete the item from cart as well.
    await db.delete(cartItemTable).where(eq(cartItemTable.id, cartItem.id));
  }

  // If the code reached this point, it means that you have more than 1 CART ITEM to be decreased in the cart.
  // So you should only decrease in 1 item product unity.
  await db.update(cartItemTable)
  .set({quantity: cartItem.quantity -1})
  .where(eq(cartItemTable.id, cartItem.id));

};
