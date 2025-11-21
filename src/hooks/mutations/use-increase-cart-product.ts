import { useMutation, useQueryClient } from "@tanstack/react-query"

import { addProductToCart } from "@/actions/add-cart-product";

import { getUseCartQueryKey } from "../queries/use-cart";


export const getIncreaseCartProductMutationkey = (productVariantId: string) =>[
    "increase-cart-product-quantity", productVariantId
] as const;

export const useIncreaseCartProduct = (productVariantId: string) => {
    
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: getIncreaseCartProductMutationkey(productVariantId),
        mutationFn: () => addProductToCart({productVariantId: productVariantId, quantity: 1}),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: getUseCartQueryKey() });
        },
    })
}