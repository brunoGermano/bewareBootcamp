import { z } from "zod";

// Creating data types to validate datas which the server action will receive.

export const addProductToCartSchema = z.object({
  productVariantId: z.uuid(),
  quantity: z.number().min(1),
});

export type AddProductToCartSchema = z.infer<typeof addProductToCartSchema>; // export the type thar are going to be the "interface" which correspond tho this schema here.
