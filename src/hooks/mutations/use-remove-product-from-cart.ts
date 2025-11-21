// parei aqui

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { removeProductFromCart } from "@/actions/remove-cart-product";

import { getUseCartQueryKey } from "../queries/use-cart";


export const getRemoveProductFromCartMutationKey = ( cartItemId: string ) => [
    "remove-cart-product",
    cartItemId
] as const;

export const useRemoveProductFromCart = (cartItemId: string) => {
    
    const QueryClient = useQueryClient();

    return useMutation({
    mutationKey: getRemoveProductFromCartMutationKey(cartItemId), 
    mutationFn: () => removeProductFromCart({cartItemId: cartItemId}),
    onSuccess: () => {
      // The "InvalidateQueries" makes the "query" named by "cart" be reloaded. 
      // So it will show the cart without the DELETED product item.
        QueryClient.invalidateQueries({ queryKey: getUseCartQueryKey() }); 
    }
  });

}