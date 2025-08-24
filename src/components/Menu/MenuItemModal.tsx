"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import type { MenuItem } from "@/types";
import { useOrder, formatRp } from "@/context/OrderContext";

type Props = {
  item: MenuItem;
  onClose: () => void;
};

const clamp = (n: number, min: number, max?: number) =>
  max != null ? Math.min(Math.max(n, min), max) : Math.max(n, min);

const Backdrop: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="fixed inset-0 z-40 bg-black/40" onClick={onClick} />
);

const ModalShell: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-2xl rounded-t-2xl bg-white shadow-2xl md:inset-0 md:my-10 md:h-fit md:max-w-lg md:rounded-2xl">
    <div className="max-h-[90vh] overflow-y-auto p-4">{children}</div>
  </div>
);

export const MenuItemModal: React.FC<Props> = ({ item, onClose }) => {
  const { addItem } = useOrder();
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [variations, setVariations] = useState<Record<string, string>>(() =>
    Object.fromEntries((item.variations ?? []).map((v) => [v.name, v.defaultChoice ?? v.choices[0] ?? ""]))
  );
  const [addons, setAddons] = useState<Record<string, number>>({});

  const addonsList = useMemo(() => item.addons ?? [], [item.addons]);

  const base = item.price;
  const addonsTotal = useMemo(
    () =>
      Object.entries(addons).reduce((sum, [addonId, aQty]) => {
        const a = addonsList.find((x) => x.id === addonId);
        return a ? sum + a.price * aQty : sum;
      }, 0),
    [addons, addonsList]
  ) || 0;
  const unitTotal = base + addonsTotal;
  const total = unitTotal * qty;

  const setAddonQty = (id: string, q: number, max?: number) => {
    setAddons((prev) => {
      const next = { ...prev };
      const clamped = clamp(q, 0, max);
      if (clamped <= 0) delete next[id];
      else next[id] = clamped;
      return next;
    });
  };

  const submit = () => {
    addItem({
      menuId: item.id,
      name: item.name,
      basePrice: item.price,
      totalPrice: unitTotal,
      addonsPrice: addonsTotal,
      quantity: qty,
      variations: Object.keys(variations).length ? variations : undefined,
      addons:
        Object.entries(addons).map(([id, q]) => {
          const a = addonsList.find((x) => x.id === id)!;
          return { id, name: a.name, price: a.price, quantity: q };
        }) ?? [],
      note: note || undefined,
    });
    onClose();
  };
  return (
    <>
      <Backdrop onClick={onClose} />
      <ModalShell>
        <div className="flex items-start gap-3">
          {item.image && (
            <div className="relative h-24 w-24 overflow-hidden rounded">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-600">{formatRp(item.price)}</p>
          </div>
          <button onClick={onClose} className="rounded px-2 py-1 text-sm text-gray-500 hover:bg-gray-100">
            Tutup
          </button>
        </div>

        {/* Variations */}
        {item.variations?.length ? (
          <div className="mt-4 space-y-3">
            {item.variations.map((v, id) => (
              <div key={id}>
                <label className="mb-1 block text-sm font-medium">
                  {v.name}
                  {v.required ? " *" : ""}
                </label>
                <select
                  className="w-full rounded border px-3 py-2 text-sm"
                  value={variations[v.name] ?? ""}
                  onChange={(e) => setVariations({ ...variations, [v.name]: e.target.value })}
                >
                  {v.choices.map((c, id) => (
                    <option key={id} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        ) : null}

        {/* Addons */}
        {addonsList.length ? (
          <div className="mt-4">
            <div className="mb-2 text-sm font-semibold">Toppings / Add-ons</div>
            <div className="space-y-2">
              {addonsList.map((a, id) => {
                const q = addons[a.id] ?? 0;
                return (
                  <div key={id} className="flex items-center justify-between rounded border p-2">
                    <div>
                      <div className="text-sm">{a.name}</div>
                      <div className="text-xs text-gray-500">{formatRp(a.price)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setAddonQty(a.id, q - 1, a.maxQty)}
                        className="h-8 w-8 rounded border text-lg leading-none"
                        aria-label="Kurangi"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{q}</span>
                      <button
                        onClick={() => setAddonQty(a.id, q + 1, a.maxQty)}
                        className="h-8 w-8 rounded border text-lg leading-none"
                        aria-label="Tambah"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Quantity & Note */}
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Jumlah</label>
            <div className="flex items-center gap-2">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-9 w-9 rounded border text-lg">
                −
              </button>
              <span className="w-8 text-center">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="h-9 w-9 rounded border text-lg">
                +
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Catatan</label>
            <input
              className="w-full rounded border px-3 py-2 text-sm"
              placeholder="Contoh: kurang asin, saus terpisah"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between">
          <div className="text-base font-semibold">Total: {formatRp(total)}</div>
          <button onClick={submit} className="rounded-lg bg-black px-4 py-2 text-white hover:opacity-90">
            Tambah ke Pesanan
          </button>
        </div>
      </ModalShell>
    </>
  );
};

