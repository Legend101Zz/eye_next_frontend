import CartInvoice from "@/presentation/components/cart/CartInvoice";
import CartProductCard from "@/presentation/components/cart/CartProductCard";
import React from "react";
import Wrapper from "@/presentation/components/Wrapper";
import OrderSummary from "@/presentation/components/cart/OrderSummery";

type Props = {};

const Cart = (props: Props) => {
  return (
    <Wrapper>
      <div className="flex justify-between">
        <div className=" flex flex-col w-full justify-between">
          <CartProductCard />
          <CartProductCard />
          <CartProductCard />
        </div>
        <div>
          <OrderSummary />
        </div>
      </div>
    </Wrapper>
  );
};

export default Cart;
