/* Using the react-query here, uses like a father on the layout.tsx from app folder
   A query is a call that obtain datas 
*/

import { useQuery } from "@tanstack/react-query";

import { getCart } from "@/actions/get-cart";


export const getUseCartQueryKey = () =>  ["cart"] as const;

export const useCart = () => {
  return useQuery({
    queryKey: getUseCartQueryKey(),

    // "queryFn" is a function that fetch the datas from the cart which is in the server since this file is a "client component".
    //  Since a "serverAction" is a kind of HTTP route accssing an API, so It is possible call "getCart()" here because it is a "serverAction".
    queryFn: () => getCart(),
  });
}