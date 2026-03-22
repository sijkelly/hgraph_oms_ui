import { useState } from "react";
import type { Order } from "@/api/types";
import type { OrderFormData } from "@/components/orders/OrderFields";
import OrderTicket from "@/components/orders/OrderTicket";
import OrderBlotter from "@/components/orders/OrderBlotter";
import OrderDetailPanel from "@/components/orders/OrderDetailPanel";
import Card from "@/components/shared/Card";

let orderSeq = 0;

function formToOrder(data: OrderFormData): Order {
  orderSeq += 1;
  const now = new Date().toISOString();
  return {
    order_id: `ORD-${String(orderSeq).padStart(4, "0")}`,
    instrument: data.instrument,
    side: data.side,
    quantity: data.quantity,
    unit: data.unit,
    price: data.price || "market",
    counterparty: data.counterparty,
    delivery_period: data.delivery_period,
    order_type: data.order_type,
    portfolio: data.portfolio,
    book: data.book,
    status: "Pending",
    filled_quantity: "",
    created_at: now,
    updated_at: now,
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);

  function handleSubmit(data: OrderFormData) {
    const order = formToOrder(data);
    setOrders((prev) => [order, ...prev]);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Order Entry</h1>

      <OrderTicket onSubmit={handleSubmit} />

      <Card title={`Order Blotter (${orders.length})`}>
        <OrderBlotter orders={orders} onSelect={setSelected} />
      </Card>

      {selected && (
        <OrderDetailPanel
          order={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
