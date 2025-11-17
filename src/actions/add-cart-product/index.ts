"use server"; // Transform this in a "server action" which will run on the server side

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartItemTable, cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { AddProductToCartSchema, addProductToCartSchema } from "./schema";

// it will define this file being a SERVER ACTION an it will be an API route from client to the server when the "adicionar a sacola" button is pressed.
export const addProductToCart = async (data: AddProductToCartSchema) => {
  // Needded to make validations here. So It is used "AddProductToCartSchema" to verify is "uuid" is valid and the "quantity" is a number with at least the value "1", both them defined in the interface "AddProductToCartSchema".

  // Verifying if the data is valid, if not that "parse" function will throw an exception.
  addProductToCartSchema.parse(data);

  // Verifying user session. Validating session from Better Auth
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  //   Verifying if the product exists because someone cant call this route passing an invalid "id" for the product.
  const productVariant = await db.query.productVariantTable.findFirst({
    where: (productVariant, { eq }) =>
      eq(productVariant.id, data.productVariantId),
  });

  if (!productVariant) {
    throw new Error("Product Variant not found");
  }

  // 1) Take the cart from the logged user here if he has this cart.
  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
  });

  // 2) If the cart doesn't exist, it is needed to create it
  let cartId = cart?.id;
  if (!cartId) {
    const [newCart] = await db
      .insert(cartTable)
      .values({ userId: session.user.id })
      .returning();
    cartId = newCart.id;
  }

  // 3) Verifies if the Product Variant that we are trying to add to the cart already exists in the "cart" to increase your quantity and not duplicate the same product on the cart
  const cartItem = await db.query.cartItemTable.findFirst({
    where: (cartItem, { eq }) =>
      eq(cartItem.cartId, cartId) &&
      eq(cartItem.productVariantId, data.productVariantId),
  });

  // 4) Updating the existing item in the cart and increasing its quantity.
  if (cartItem) {
    await db
      .update(cartItemTable)
      .set({
        quantity: cartItem.quantity + data.quantity,
      })
      .where(eq(cartItemTable.id, cartItem.id));
    return; // QUit the function Component "addProductToCart" because the product was added successfully to the cart.
  }

  // 5) The item doesn't exist in the cart because it didn't enter on the past "if". So It should insert it in the "cartItemTable"
  await db.insert(cartItemTable).values({
    cartId,
    productVariantId: data.productVariantId,
    quantity: data.quantity,
  });
};
