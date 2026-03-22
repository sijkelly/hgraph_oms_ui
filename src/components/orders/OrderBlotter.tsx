import type { Order, OrderStatus } from "@/api/types";
import { cn } from "@/lib/utils";

interface OrderBlotterProps {
  orders: Order[];
  onSelect?: (order: Order) => void;
  onCancel?: (orderId: string) => void;
}

const statusColors: Record<OrderStatus, string> = {
  Pending: "bg-slate-100 text-slate-700",
  Working: "bg-blue-100 text-blue-800",
  Filled: "bg-green-100 text-green-800",
  "Partially Filled": "bg-amber-100 text-amber-800",
  Rejected: "bg-red-100 text-red-800",
  Cancelled: "bg-gray-100 text-gray-500",
};

const sideColors: Record<string, string> = {
  Buy: "text-blue-700 font-semibold",
  Sell: "text-red-700 font-semibold",
};

const cancellable = new Set<OrderStatus>(["Pending", "Working"]);

export default function OrderBlotter({ orders, onSelect, onCancel }: OrderBlotterProps) {
  if (orders.length === 0) {
    return (
      <p className="text-sm text-slate-500 py-4">
        No orders yet. Use the order entry above to create one.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
            <th className="px-3 py-3">Time</th>
            <th className="px-3 py-3">Side</th>
            <th className="px-3 py-3">Instrument</th>
            <th className="px-3 py-3 text-right">Qty</th>
            <th className="px-3 py-3 text-right">Price</th>
            <th className="px-3 py-3">Type</th>
            <th className="px-3 py-3">Counterparty</th>
            <th className="px-3 py-3">Delivery</th>
            <th className="px-3 py-3 text-right">Filled</th>
            <th className="px-3 py-3">Status</th>
            {onCancel && <th className="px-3 py-3"></th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => (
            <tr
              key={order.order_id}
              onClick={() => onSelect?.(order)}
              className={cn(
                "hover:bg-slate-50 transition-colors",
                onSelect && "cursor-pointer",
              )}
            >
              <td className="px-3 py-2.5 text-xs text-slate-500 whitespace-nowrap">
                {new Date(order.created_at).toLocaleTimeString()}
              </td>
              <td className={cn("px-3 py-2.5", sideColors[order.side] ?? "")}>
                {order.side}
              </td>
              <td className="px-3 py-2.5 font-medium text-slate-900">
                {order.instrument}
              </td>
              <td className="px-3 py-2.5 text-right font-mono">
                {order.quantity} {order.unit}
              </td>
              <td className="px-3 py-2.5 text-right font-mono">
                {order.price}
              </td>
              <td className="px-3 py-2.5">{order.order_type}</td>
              <td className="px-3 py-2.5">{order.counterparty}</td>
              <td className="px-3 py-2.5">{order.delivery_period}</td>
              <td className="px-3 py-2.5 text-right font-mono">
                {order.filled_quantity || "\u2014"}
              </td>
              <td className="px-3 py-2.5">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    statusColors[order.status] ?? "bg-gray-100 text-gray-700",
                  )}
                >
                  {order.status}
                </span>
              </td>
              {onCancel && (
                <td className="px-3 py-2.5">
                  {cancellable.has(order.status) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCancel(order.order_id);
                      }}
                      className="text-xs text-red-600 hover:text-red-800 font-medium"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
