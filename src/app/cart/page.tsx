import { ProtectedRoute } from "@/components/auth/ProtectedRoutes/ProtectedRoute";
import CartInvoice from "@/components/cart/CartInvoice";
import CartProductCard from "@/components/cart/CartProductCard";
import Wrapper from "@/components/Wrapper";
import OrderSummary from "@/components/cart/OrderSummery";

export default function Cart() {
  return (
    <ProtectedRoute>
      <Wrapper>
        <div className="flex justify-between">
          <div className="flex flex-col w-full justify-between">
            <CartProductCard />
            <CartProductCard />
            <CartProductCard />
          </div>
          <div>
            <OrderSummary />
          </div>
        </div>
      </Wrapper>
    </ProtectedRoute>
  );
}