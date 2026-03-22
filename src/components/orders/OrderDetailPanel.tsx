import type { Order, OrderStatus } from "@/api/types";
import { X } from "lucide-react";

interface OrderDetailPanelProps {
  order: Order;
  onClose: () => void;
  onCancel?: (orderId: string) => void;
  onAmend?: (orderId: string, status: string) => void;
}

const cancellable = new Set<OrderStatus>(["Pending", "Working"]);
const amendableStatuses: OrderStatus[] = ["Pending", "Working", "Filled", "Partially Filled", "Rejected", "Cancelled"];

export default function OrderDetailPanel({ order, onClose, onCancel, onAmend }: OrderDetailPanelProps) {
  const canCancel = cancellable.has(order.status);

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-900">
          Order Detail — {order.order_id}
        </h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600"
        >
          <X size={16} />
        </button>
      </div>
      <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <Field label="Side" value={order.side} />
        <Field label="Instrument" value={order.instrument} />
        <Field label="Quantity" value={`${order.quantity} ${order.unit}`} />
        <Field label="Price" value={order.price} />
        <Field label="Order Type" value={order.order_type} />
        <Field label="Counterparty" value={order.counterparty} />
        <Field label="Delivery Period" value={order.delivery_period} />
        <Field label="Portfolio" value={order.portfolio || "\u2014"} />
        <Field label="Book" value={order.book || "\u2014"} />
        <Field label="Status" value={order.status} />
        <Field label="Filled" value={order.filled_quantity || "\u2014"} />
        <Field label="Created" value={new Date(order.created_at).toLocaleString()} />
        <Field label="Updated" value={new Date(order.updated_at).toLocaleString()} />
      </div>

      {(onCancel || onAmend) && (
        <div className="border-t border-slate-200 px-4 py-3 flex gap-2">
          {onAmend && (
            <select
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  onAmend(order.order_id, e.target.value);
                  e.target.value = "";
                }
              }}
              className="text-sm border border-slate-300 rounded-md px-2 py-1.5 text-slate-700 bg-white"
            >
              <option value="" disabled>
                Change status...
              </option>
              {amendableStatuses
                .filter((s) => s !== order.status)
                .map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
            </select>
          )}
          {onCancel && canCancel && (
            <button
              onClick={() => onCancel(order.order_id)}
              className="text-sm px-3 py-1.5 rounded-md bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 font-medium"
            >
              Cancel Order
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-slate-900">{value}</dd>
    </div>
  );
}
