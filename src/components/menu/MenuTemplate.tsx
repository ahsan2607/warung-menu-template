// app/menu/MenuTemplate.tsx
"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import Menu from "@/components/menu/Menu";

export default function MenuTemplate() {
  const params = useSearchParams();
  const table = params.get("table") ?? undefined;

  return (
    <div className="min-h-dvh bg-gray-50">
      <div className="mx-auto max-w-5xl p-2">
        <header className="mb-4 flex items-baseline justify-between">
          <h1 className="text-2xl font-bold">Menu</h1>
          {table && <p className="text-sm text-gray-600">Table: {table}</p>}
        </header>
        <Menu />
      </div>
    </div>
  );
}
