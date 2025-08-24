// app/menu/MenuPageClient.tsx
"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import Menu from "@/components/menu/Menu";

export default function MenuPageClient() {
  const params = useSearchParams();
  const table = params.get("table") ?? undefined;

  return (
    <div className="min-h-dvh bg-gray-50">
      <header className="sticky top-0 z-30 bg-white shadow">
        <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-2 px-2 py-3">
          <div className="flex flex-col md:flex-row md:items-center gap-1">
            <span className="text-2xl font-bold tracking-tight">KAPE WAWAW</span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-2">
        <header className="mb-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Menu</span>
            {table && <span className="font-semibold">Table: {table}</span>}
          </div>
        </header>
        <Menu />
      </main>
    </div>
  );
}
