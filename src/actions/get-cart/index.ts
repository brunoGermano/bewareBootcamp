"use server";

import { headers } from "next/headers";

import { db } from "@/db";
import { cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const getCart = async () => {
  // Verifying the user session.
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Returning the user cart with its items. Inside each variantProduct I recover the product which this variantProduct belongs
  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
    with: {
      items: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });

  // If there is no cart yet, it should create one.
  if (!cart) {
    const [newCart] = await db
      .insert(cartTable)
      .values({
        userId: session.user.id,
      })
      .returning();
    return {
      ...newCart,
      items: [], // Since this cart is NEW there is no items in it, so the "items" array is empty too because the newCart is empty.
      totalPriceInCents: 0,
    };
  }
  return {
    ...cart,
    // Calc about financial datas must be done on the backend, so it is made here on this SERVER COMPONENT "getCart".
    totalPriceInCents: cart.items.reduce(
      (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
      0,
    ),
  };
};
