import type { OrderFormData } from "./OrderFields";
import { SIDE_OPTIONS, ORDER_TYPE_OPTIONS, UNIT_OPTIONS } from "./OrderFields";

interface StructuredOrderFormProps {
  data: OrderFormData;
  onChange: (data: OrderFormData) => void;
  confidences?: Record<string, number>;
}

function fieldClass(confidence?: number): string {
  if (confidence === undefined) return "";
  if (confidence >= 0.8) return "ring-2 ring-green-300";
  if (confidence >= 0.5) return "ring-2 ring-amber-300";
  return "ring-2 ring-red-300";
}

function ConfidenceDot({ confidence }: { confidence?: number }) {
  if (confidence === undefined) return null;
  const color =
    confidence >= 0.8
      ? "bg-green-500"
      : confidence >= 0.5
        ? "bg-amber-500"
        : "bg-red-500";
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${color} ml-1`}
      title={`Confidence: ${(confidence * 100).toFixed(0)}%`}
    />
  );
}

export default function StructuredOrderForm({
  data,
  onChange,
  confidences,
}: StructuredOrderFormProps) {
  function set(field: keyof OrderFormData, value: string) {
    onChange({ ...data, [field]: value });
  }

  const inputCls =
    "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Side */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Side <ConfidenceDot confidence={confidences?.side} />
        </label>
        <select
          value={data.side}
          onChange={(e) => set("side", e.target.value)}
          className={`${inputCls} ${fieldClass(confidences?.side)}`}
        >
          <option value="">Select...</option>
          {SIDE_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Instrument */}
      <div className="lg:col-span-2">
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Instrument <ConfidenceDot confidence={confidences?.instrument} />
        </label>
        <input
          type="text"
          placeholder="e.g. Henry Hub Natural Gas"
          value={data.instrument}
          onChange={(e) => set("instrument", e.target.value)}
          className={`${inputCls} ${fieldClass(confidences?.instrument)}`}
        />
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Quantity <ConfidenceDot confidence={confidences?.quantity} />
        </label>
        <input
          type="text"
          placeholder="50000"
          value={data.quantity}
          onChange={(e) => set("quantity", e.target.value)}
          className={`${inputCls} ${fieldClass(confidences?.quantity)}`}
        />
      </div>

      {/* Unit */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Unit <ConfidenceDot confidence={confidences?.unit} />
        </label>
        <select
          value={data.unit}
          onChange={(e) => set("unit", e.target.value)}
          className={`${inputCls} ${fieldClass(confidences?.unit)}`}
        >
          <option value="">Select...</option>
          {UNIT_OPTIONS.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Price <ConfidenceDot confidence={confidences?.price} />
        </label>
        <input
          type="text"
          placeholder="3.45 or market"
          value={data.price}
          onChange={(e) => set("price", e.target.value)}
          className={`${inputCls} ${fieldClass(confidences?.price)}`}
        />
      </div>

      {/* Order Type */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Order Type <ConfidenceDot confidence={confidences?.order_type} />
        </label>
        <select
          value={data.order_type}
          onChange={(e) => set("order_type", e.target.value)}
          className={`${inputCls} ${fieldClass(confidences?.order_type)}`}
        >
          {ORDER_TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Counterparty */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Counterparty <ConfidenceDot confidence={confidences?.counterparty} />
        </label>
        <input
          type="text"
          placeholder="ACME"
          value={data.counterparty}
          onChange={(e) => set("counterparty", e.target.value)}
          className={`${inputCls} ${fieldClass(confidences?.counterparty)}`}
        />
      </div>

      {/* Delivery Period */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Delivery Period <ConfidenceDot confidence={confidences?.delivery_period} />
        </label>
        <input
          type="text"
          placeholder="January 2026"
          value={data.delivery_period}
          onChange={(e) => set("delivery_period", e.target.value)}
          className={`${inputCls} ${fieldClass(confidences?.delivery_period)}`}
        />
      </div>

      {/* Portfolio */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Portfolio <ConfidenceDot confidence={confidences?.portfolio} />
        </label>
        <input
          type="text"
          placeholder="GAS-TRADING"
          value={data.portfolio}
          onChange={(e) => set("portfolio", e.target.value)}
          className={`${inputCls} ${fieldClass(confidences?.portfolio)}`}
        />
      </div>

      {/* Book */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Book <ConfidenceDot confidence={confidences?.book} />
        </label>
        <input
          type="text"
          placeholder="GAS-BOOK-1"
          value={data.book}
          onChange={(e) => set("book", e.target.value)}
          className={`${inputCls} ${fieldClass(confidences?.book)}`}
        />
      </div>

      {/* Notes */}
      <div className="md:col-span-2 lg:col-span-3">
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Notes
        </label>
        <textarea
          rows={2}
          placeholder="Additional notes..."
          value={data.notes}
          onChange={(e) => set("notes", e.target.value)}
          className={inputCls}
        />
      </div>
    </div>
  );
}
