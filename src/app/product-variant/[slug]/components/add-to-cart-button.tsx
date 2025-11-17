// This component need to be a clientComponent, since it will needed to be used in a serverComponent, "ProductVariantPage", later.

"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { addProductToCart } from "@/actions/add-cart-product";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  productVariantId: string;
  quantity: number;
}

const AddToCartButton = ({
  productVariantId,
  quantity,
}: AddToCartButtonProps) => {
  const queryClient = useQueryClient();

  // Use mutation is an operation where you will change data, you can create, update, delete and so on.
  const { mutate, isPending } = useMutation({
    // It is a GOOD PRACTICE to pass your mutation fucntion parameters to your mutationKey too.
    mutationKey: ["addProductToCart", productVariantId, quantity],

    // The function which will do the operation on the data. This function will call the action created before, "addProductToCart()"
    mutationFn: () =>
      addProductToCart({
        productVariantId,
        quantity,
      }),
    onSuccess: () => {
      // the "invalidateQueries" method orders the reactQuery do all the queries that have the key "cart" again, so the new products added will appear immediately on the cart. From one component you can update the other one. The "onSuccess" function only execute if the mutation work successfully.
      // SO from differents components it is possible update datas in other components which use this datas as well.
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
  return (
    <Button
      className="rounded-full"
      size="lg"
      variant="outline"
      disabled={isPending}
      onClick={() => mutate()}
    >
      {isPending && <Loader2 className="animate-spin" />}
      Adicionar à sacola
    </Button>
  );
};

export default AddToCartButton;
