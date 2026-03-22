import OrderTicket from "@/components/orders/OrderTicket";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Order Entry</h1>
      <OrderTicket />
    </div>
  );
}
