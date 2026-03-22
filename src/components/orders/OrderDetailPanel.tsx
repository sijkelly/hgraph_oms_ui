import type { Order } from "@/api/types";
import { X } from "lucide-react";

interface OrderDetailPanelProps {
  order: Order;
  onClose: () => void;
}

export default function OrderDetailPanel({ order, onClose }: OrderDetailPanelProps) {
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
        <Field label="Portfolio" value={order.portfolio || "—"} />
        <Field label="Book" value={order.book || "—"} />
        <Field label="Status" value={order.status} />
        <Field label="Filled" value={order.filled_quantity || "—"} />
        <Field label="Created" value={new Date(order.created_at).toLocaleString()} />
        <Field label="Updated" value={new Date(order.updated_at).toLocaleString()} />
      </div>
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
