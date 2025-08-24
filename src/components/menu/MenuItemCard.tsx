"use client";
import React, { useState } from "react";
import Image from "next/image";
import type { MenuItem } from "@/types";
import { formatRp, useOrder } from "@/context/OrderContext";
import MenuItemModal from "./MenuItemModal";
import { Minus, Plus } from "lucide-react";

const MenuItemCard: React.FC<{ item: MenuItem; viewMode?: "list" | "grid" }> = ({ item, viewMode = "grid" }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useOrder();

  const hasOptions = (item.addons?.length || item.variations?.length) ?? false;

  const handleAddDirect = () => {
    if (quantity < 1) return;
    addItem({
      name: item.name,
      menuId: item.id,
      basePrice: item.price,
      totalPrice: item.price,
      quantity,
    });
    setQuantity(1); // reset after adding
  };

  // List layout
  if (viewMode === "list") {
    return (
      <>
        <div className="flex items-center gap-1 rounded-lg border bg-white p-2 shadow-sm">
          {item.image && (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded">
              <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-medium text-sm">{item.name}</h3>
                <p className="text-sm text-gray-600">{formatRp(item.price)}</p>
              </div>

              {hasOptions ? (
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-20 rounded-lg bg-black px-3 py-1.5 text-sm text-white hover:opacity-90"
                >
                  Pilih
                </button>
              ) : (
                <div className="flex flex-col items-center gap-2 min-w-20">
                  <div className="flex items-center justify-between w-full">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-6 w-6 flex items-center justify-center rounded border text-md leading-none"
                      aria-label="Kurangi"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-6 text-center text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-6 w-6 flex items-center justify-center rounded border text-md leading-none"
                      aria-label="Tambah"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={handleAddDirect}
                    className="w-full rounded-lg bg-black px-3 py-1.5 text-sm text-white hover:opacity-90"
                  >
                    Pilih
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {modalOpen && <MenuItemModal item={item} onClose={() => setModalOpen(false)} />}
      </>
    );
  }

  // Grid layout
  if (viewMode === "grid") {
  return (
    <>
      <div className="rounded-lg border bg-white p-2 shadow-sm flex flex-col h-full min-w-0">
        {item.image && (
          <div className="relative mb-1 h-20 w-full overflow-hidden rounded">
            <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
          </div>
        )}
        <div className="mb-1 items-center justify-between min-w-0">
          <h3
            className="font-medium text-xs truncate max-w-[110px]"
            title={item.name}
          >
            {item.name}
          </h3>
          <span className="text-gray-700 text-xs">{formatRp(item.price)}</span>
        </div>

        <div className="mt-auto">
          {hasOptions ? (
            <button
              onClick={() => setModalOpen(true)}
              className="w-full rounded bg-black px-2 py-1 text-xs text-white hover:opacity-90"
            >
              Pilih
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-10 rounded border px-1 py-0.5 text-xs"
              />
              <button
                onClick={handleAddDirect}
                className="flex-1 rounded bg-black px-2 py-1 text-xs text-white hover:opacity-90"
              >
                Tambah
              </button>
            </div>
          )}
        </div>
      </div>
      {modalOpen && <MenuItemModal item={item} onClose={() => setModalOpen(false)} />}
    </>
  );
}
};

export default MenuItemCard;
