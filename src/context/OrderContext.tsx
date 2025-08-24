"use client";
import React, { createContext, useContext, useMemo, useState } from "react";

export type OrderAddon = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type OrderItem = {
  id: string; // unique per-cart row
  menuId: string; // points to menu item id
  name: string;
  basePrice: number;
  quantity: number;
  totalPrice: number;
  addonsPrice?: number;
  variations?: Record<string, string>; // { Spiciness: 'Hot' }
  addons?: OrderAddon[];
  note?: string;
};

export type OrderState = {
  table?: string;
  items: OrderItem[];
};

type OrderContextValue = {
  order: OrderState;
  setTable: (t?: string) => void;
  // addItem: (item: Omit<OrderItem, "id">) => void;
  addItem: (item: Omit<OrderItem, "id">) => void;
  removeItem: (id: string) => void;
  updateItemQty: (id: string, qty: number) => void;
  updateAddonQty: (id: string, addonId: string, qty: number) => void;
  clearOrder: () => void;
  subtotal: number;
};

const OrderContext = createContext<OrderContextValue | null>(null);

export const useOrder = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within OrderProvider");
  return ctx;
};

export const formatRp = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const computeItemTotal = (it: OrderItem) => {
  return it.totalPrice * it.quantity;
};

export const OrderProvider: React.FC<React.PropsWithChildren<{ initialTable?: string }>> = ({
  children,
  initialTable,
}) => {
  const [order, setOrder] = useState<OrderState>({ table: initialTable, items: [] });

  const setTable = (t?: string) => setOrder((prev) => ({ ...prev, table: t }));

  const addItem = (item: Omit<OrderItem, "id">) => {
    setOrder((prev) => {
      // Find if an identical item already exists
      const foundIdx = prev.items.findIndex(
        (i) =>
          i.menuId === item.menuId &&
          i.basePrice === item.basePrice &&
          i.totalPrice === item.totalPrice &&
          (i.addonsPrice ?? 0) === (item.addonsPrice ?? 0) &&
          i.name === item.name &&
          JSON.stringify(i.variations ?? {}) === JSON.stringify(item.variations ?? {}) &&
          JSON.stringify(i.addons ?? []) === JSON.stringify(item.addons ?? []) &&
          (i.note ?? "") === (item.note ?? "")
      );
      if (foundIdx !== -1) {
        // If found, increase quantity
        const items = [...prev.items];
        items[foundIdx] = {
          ...items[foundIdx],
          quantity: items[foundIdx].quantity + item.quantity,
        };
        return { ...prev, items };
      } else {
        // If not found, add as new
        const id = crypto?.randomUUID?.() ?? String(Date.now() + Math.random());
        return { ...prev, items: [...prev.items, { ...item, id }] };
      }
    });
  };

  const removeItem = (id: string) => {
    setOrder((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== id) }));
  };

  const updateItemQty = (id: string, qty: number) => {
    setOrder((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)),
    }));
  };

  const updateAddonQty = (id: string, addonId: string, qty: number) => {
    setOrder((prev) => ({
      ...prev,
      items: prev.items.map((i) => {
        if (i.id !== id) return i;
        const addons = (i.addons ?? []).map((a) => (a.id === addonId ? { ...a, quantity: Math.max(0, qty) } : a));
        return { ...i, addons };
      }),
    }));
  };

  const clearOrder = () => setOrder({ table: order.table, items: [] });

  const subtotal = useMemo(() => order.items.reduce((s, it) => s + computeItemTotal(it), 0), [order.items]);

  const value: OrderContextValue = {
    order,
    setTable,
    addItem,
    removeItem,
    updateItemQty,
    updateAddonQty,
    clearOrder,
    subtotal,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};
