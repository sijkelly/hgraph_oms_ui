import { useState } from "react";
import type { Order } from "@/api/types";
import type { OrderFormData } from "@/components/orders/OrderFields";
import { useOrders, useCreateOrder, useCancelOrder, useUpdateOrderStatus } from "@/api/hooks";
import OrderTicket from "@/components/orders/OrderTicket";
import OrderBlotter from "@/components/orders/OrderBlotter";
import OrderDetailPanel from "@/components/orders/OrderDetailPanel";
import Card from "@/components/shared/Card";

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useOrders();
  const createOrder = useCreateOrder();
  const cancelOrder = useCancelOrder();
  const updateStatus = useUpdateOrderStatus();
  const [selected, setSelected] = useState<Order | null>(null);

  function handleSubmit(data: OrderFormData) {
    createOrder.mutate({
      instrument: data.instrument,
      side: data.side,
      quantity: data.quantity,
      unit: data.unit,
      price: data.price,
      counterparty: data.counterparty,
      delivery_period: data.delivery_period,
      order_type: data.order_type,
      portfolio: data.portfolio,
      book: data.book,
    });
  }

  function handleCancel(orderId: string) {
    cancelOrder.mutate(orderId);
    if (selected?.order_id === orderId) setSelected(null);
  }

  function handleAmend(orderId: string, status: string) {
    updateStatus.mutate({ orderId, status });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Order Entry</h1>

      <OrderTicket onSubmit={handleSubmit} />

      {createOrder.isError && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {createOrder.error.message}
        </div>
      )}

      <Card title={`Order Blotter (${orders.length})`}>
        {isLoading ? (
          <p className="text-sm text-slate-500 py-4">Loading orders...</p>
        ) : (
          <OrderBlotter
            orders={orders}
            onSelect={setSelected}
            onCancel={handleCancel}
          />
        )}
      </Card>

      {selected && (
        <OrderDetailPanel
          order={selected}
          onClose={() => setSelected(null)}
          onCancel={handleCancel}
          onAmend={handleAmend}
        />
      )}
    </div>
  );
}
