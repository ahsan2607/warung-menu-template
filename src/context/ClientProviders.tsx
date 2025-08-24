"use client";
import { useSearchParams } from "next/navigation";
import { OrderProvider } from "@/context/OrderContext";
import { MenuDataProvider } from "@/context/MenuDataContext";
import { ReactNode } from "react";

export default function ClientProviders({ children }: { children: ReactNode }) {
  const params = useSearchParams();
  const table = params.get("table") ?? undefined;

  return (
    <OrderProvider initialTable={table}>
      <MenuDataProvider>{children}</MenuDataProvider>
    </OrderProvider>
  );
}