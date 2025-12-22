import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { db } from "@/db";
import { cartTable, shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import CartSummary from "../components/cart-summary";
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
        where: (cart, { eq }) => eq(cart.userId, session.user.id),
        with:{
            shippingAddress: true,
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

    // console.log(cart)
    // console.log(cart?.items.length)

    // If there is no cart or even products in the cart, the user should be redirected to the home page.
    if( !cart || cart?.items.length === 0 ){
        redirect("/");
    }

    const shippingAddresses = await db.query.shippingAddressTable.findMany({
        where: eq(shippingAddressTable.userId, session.user.id),
    });

    const cartTotalInCents = cart.items.reduce(
        (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
        0,
    );

    return (
    <div className="space-y-12">
      <Header />
      <div className="space-y-4 px-5">
        <Addresses
          shippingAddresses={shippingAddresses}
          defaultShippingAddressId={cart.shippingAddress?.id || null}
        />
        <CartSummary
          subtotalInCents={cartTotalInCents}
          totalInCents={cartTotalInCents}
          products={cart.items.map((item) => ({
            id: item.productVariant.id,
            name: item.productVariant.product.name,
            variantName: item.productVariant.name,
            quantity: item.quantity,
            priceInCents: item.productVariant.priceInCents,
            imageUrl: item.productVariant.imageUrl,
          }))}
        />
      </div>
      <Footer />
    </div>
  );
};

export default IdentificationPage;