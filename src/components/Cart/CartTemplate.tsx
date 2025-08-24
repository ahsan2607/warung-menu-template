"use client";
import React from "react";
import { useOrder } from "@/context/OrderContext";
import { useRouter } from "next/navigation";
import Cart from "@/components/Cart/Cart";

export default function CartTemplate() {
  const { order } = useOrder();
  const router = useRouter();

  return (
    <>
      <header className="sticky top-0 z-30 bg-white shadow">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-2 py-3">
          <span className="text-2xl font-bold tracking-tight">KAPE WAWAW</span>
          <button
            onClick={() => router.push("/" + (order.table ? `?table=${order.table}` : ""))}
            className="text-sm text-gray-600 hover:underline"
          >
            Back to Menu
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-2">
        <header className="mb-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Your Order</span>
            {order.table && <span className="font-semibold">Table: {order.table}</span>}
          </div>
        </header>
        <Cart />
      </main>
    </>
  );
}
