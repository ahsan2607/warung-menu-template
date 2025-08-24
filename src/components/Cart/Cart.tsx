"use client";
import React, { useState } from "react";
import { useOrder, formatRp } from "@/context/OrderContext";
import { Plus } from "lucide-react";
import { submitOrders } from "@/libraries/api";

export const Cart = () => {
  const { order, subtotal, updateItemQty, removeItem, clearOrder } = useOrder();
  const [openDetails, setOpenDetails] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  const toggleDetail = (id: string) => {
    setOpenDetails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmitOrders = async () => {
    if (!order.items.length) return;
    setSubmitting(true);
    try {
      const response = await submitOrders(order.items, order.table);
      if (response.success) {
        alert(response.data?.message);
        clearOrder();
      } else {
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      alert(`Failed to submit orders: ${error}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <aside className="rounded-lg border bg-white p-2 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Pesanan</h2>
        {order.table && <span className="text-xs text-gray-600">Table {order.table}</span>}
      </div>

      {!order.items.length ? (
        <p className="text-sm text-gray-500">Belum ada pesanan.</p>
      ) : (
        <div className="space-y-3">
          {order.items.map((it) => (
            <div key={it.id} className="rounded border p-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {it.name} {" \u00D7 "} {it.quantity}
                  </div>
                  <div className="text-xs text-gray-600">
                    {formatRp(it.basePrice + (it.addons?.reduce((s, a) => s + a.price * a.quantity, 0) ?? 0))}
                  </div>
                </div>

                <div className="font-medium">
                  {formatRp(
                    (it.basePrice + (it.addons?.reduce((s, a) => s + a.price * a.quantity, 0) ?? 0)) * it.quantity
                  )}
                </div>
              </div>

              <button
                onClick={() => toggleDetail(it.id)}
                className={`${openDetails[it.id] ?? "mb-2"} text-xs underline`}
                aria-expanded={!!openDetails[it.id]}
              >
                {openDetails[it.id] ? "Sembunyikan" : "Detail"}
              </button>
              {openDetails[it.id] && (
                <div className="mb-2 space-y-1 text-xs text-gray-700">
                  <div className="flex justify-between">
                    <span>{it.name}</span>
                    <span className="text-gray-600">{formatRp(it.basePrice)}</span>
                  </div>
                  {it.addons
                    ? it
                        .addons!.filter((a) => a.quantity > 0)
                        .map((a) => (
                          <div key={a.id} className="flex justify-between">
                            <span>
                              {a.name} {" \u00D7 "} {a.quantity}
                            </span>
                            <span className="text-gray-600">{formatRp(a.price * a.quantity)}</span>
                          </div>
                        ))
                    : null}
                  {it.variations &&
                    Object.entries(it.variations).map(([k, v]) => (
                      <div key={k}>
                        <span className="font-medium">{k}:</span> {v}
                      </div>
                    ))}
                  {it.note && (
                    <div>
                      <span className="font-medium">Catatan:</span> {it.note}
                    </div>
                  )}
                </div>
              )}

              <div className="flex border-t pt-1 items-center justify-between">
                <button onClick={() => removeItem(it.id)} className="rounded text-xs text-gray-900 hover:bg-gray-100">
                  Hapus
                </button>
                <button onClick={() => updateItemQty(it.id, it.quantity + 1)} className="h-4 w-4 text-gray-900">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}

          <div className="mt-2 flex items-center justify-between border-t pt-3">
            <div className="text-base font-semibold">Subtotal</div>
            <div className="text-base font-semibold">{formatRp(subtotal)}</div>
          </div>

          <div className="flex gap-2">
            <button onClick={clearOrder} className="flex-1 rounded border px-3 py-2 text-sm hover:bg-gray-50">
              Kosongkan
            </button>
            <button
              onClick={handleSubmitOrders}
              disabled={submitting}
              className="flex-1 rounded bg-black px-3 py-2 text-sm text-white hover:opacity-90"
            >
              {submitting ? "Mengirim..." : "Kirim Pesanan"}
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
