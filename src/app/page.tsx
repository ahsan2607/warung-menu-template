// app/menu/page.tsx (server component by default)
import { OrderProvider } from "@/context/OrderContext";
import MenuTemplate from "@/components/menu/MenuTemplate";

export default function MenuPage() {
  return (
    <OrderProvider>
      <MenuTemplate />
    </OrderProvider>
  );
}
