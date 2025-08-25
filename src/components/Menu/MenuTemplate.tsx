"use client";
import React from "react";
import { Menu } from "./Menu";
import { useOrder } from "@/context/OrderContext";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";

export const MenuTemplate = () => {
  const { order } = useOrder();
  const router = useRouter();

  return (
    <>
      <header className="sticky top-0 z-30 bg-white shadow">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-2 py-3">
          <span className="text-2xl font-bold tracking-tight">KAPE WAWAW</span>
          <button
            onClick={() => router.push("/cart" + (order.table ? `?table=${order.table}` : ""))}
            className="relative md:hidden"
            aria-label="View Cart"
          >
            <ShoppingCart className="h-7 w-7 text-gray-700" />
            {order.items.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white font-bold shadow">
                {order.items.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-2">
        <header className="mb-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Menu</span>
            {order.table && <span className="font-semibold">Table: {order.table}</span>}
          </div>
        </header>
        <Menu />
      </main>
    </>
  );
};
