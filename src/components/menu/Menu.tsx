"use client";
import React, { useState } from "react";
import { List, Grid, Minus, Plus } from "lucide-react";
import { menuData } from "./data";
import MenuItemCard from "./MenuItemCard";
import Cart from "../order/Cart";

const SectionAccordion: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      <button className="w-full p-2 flex items-center justify-between text-left" onClick={() => setOpen(!open)}>
        <span className="font-semibold">{title}</span>
        <span className="text-lg">{open ? <Minus /> : <Plus />}</span>
      </button>

      {open && (
        <div className="p-2 pt-0">
          <div className="flex justify-end gap-2 py-2">
            <button
              onClick={() => setViewMode("list")}
              className={`rounded px-2 py-1 text-sm border ${viewMode === "list" ? "bg-gray-200" : "bg-gray-50"}`}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded px-2 py-1 text-sm border ${viewMode === "grid" ? "bg-gray-200" : "bg-gray-50"}`}
              title="Grid view"
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>
          
          <div className={viewMode === "grid" ? "grid gap-2 grid-cols-2" : "flex flex-col gap-1"}>
            {children &&
              React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) return child;
                // Tell TypeScript this is a MenuItemCard
                return React.cloneElement(child as React.ReactElement<{ viewMode?: "list" | "grid" }>, { viewMode });
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Menu() {
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        {menuData.map((section) => (
          <SectionAccordion key={section.title} title={section.title}>
            {section.items.map((it) => (
              <MenuItemCard key={it.id} item={it} />
            ))}
          </SectionAccordion>
        ))}
      </div>

      {/* Order summary / cart */}
      <div className="md:sticky md:top-4 h-fit">
        <Cart />
      </div>
    </div>
  );
}
