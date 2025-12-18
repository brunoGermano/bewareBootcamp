import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Header } from "@/components/common/header";
import { db } from "@/db";
import { cartTable, shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import Addresses from "./components/addresses";

const IdentificationPage = async () => {
    
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if(!session?.user.id){
        // Send the user to home, It doesn't need the "return" because "redirect" already exits the component "IdentificationPage" here.
        redirect("/");
    }

    const cart = await db.query.cartTable.findFirst({
        where: eq(cartTable.userId, session.user.id ),
        with:{
            items: true,
        },
    });

    // console.log(cart)
    // console.log(cart?.items.length)

    // If there is no cart or even products in the cart, the user should be redirected to the home page.
    if( !cart || cart?.items.length === 0 ){
        redirect("/");
    }

    const shippingAddresses = await db.query.shippingAddressTable.findMany({
        where: eq(shippingAddressTable.userId, session.user.id),
    });

    return(
        <>
            <Header />
            <div className="px-5">
                <Addresses shippingAddresses={shippingAddresses} />
            </div>
        </>
    );
};

export default IdentificationPage;