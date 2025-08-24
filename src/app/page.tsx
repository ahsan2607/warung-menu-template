// app/menu/page.tsx (server component by default)
import { OrderProvider } from "@/context/OrderContext";
import MenuTemplate from "@/components/menu/MenuTemplate";
import { Suspense } from "react";

export default function MenuPage() {
  return (
    <OrderProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <MenuTemplate />
      </Suspense>
    </OrderProvider>
  );
}
