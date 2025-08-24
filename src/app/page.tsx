"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { OrderProvider } from "@/context/OrderContext";
import Menu from "@/components/menu/Menu";

export default function MenuPage() {
  const params = useSearchParams();
  const table = params.get("table") ?? undefined; // e.g. /menu?table=5

  return (
    <OrderProvider initialTable={table}>
      <div className="min-h-dvh bg-gray-50">
        <div className="mx-auto max-w-5xl p-2">
          <header className="mb-4 flex items-baseline justify-between">
            <h1 className="text-2xl font-bold">Menu</h1>
            {table && <p className="text-sm text-gray-600">Table: {table}</p>}
          </header>
          <Menu />
        </div>
      </div>
    </OrderProvider>
  );
}
