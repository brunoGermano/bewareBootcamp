import { useQuery } from "@tanstack/react-query";

import { getUserAddresses } from "@/actions/get-user-addresses";
import { shippingAddressTable } from "@/db/schema";

export const getUserAddressesQueryKey = () => ["user-addresses"] as const;
  
// Using the "prop" on the component "useUserAddresses" to avoid the initial loading on screen, it is because the server component will do the first load of our addresses, 
// it is a good way to use "useQuery" with a server component together to avoid the unpleasant visual loading effect when the screen is rendered.
export const useUserAddresses = (params?: {
  initialData?: (typeof shippingAddressTable.$inferSelect)[];
}) => {
  return useQuery({
    queryKey: getUserAddressesQueryKey(),
    queryFn: getUserAddresses,
    initialData: params?.initialData,
  });
};