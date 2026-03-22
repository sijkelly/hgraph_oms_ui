import { useState } from "react";
import { ClipboardList, MessageSquare, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderFormData } from "./OrderFields";
import { EMPTY_ORDER } from "./OrderFields";
import StructuredOrderForm from "./StructuredOrderForm";
import ChatPasteEntry from "./ChatPasteEntry";
import NLPOrderEntry from "./NLPOrderEntry";
import Card from "@/components/shared/Card";

type EntryMode = "structured" | "paste" | "nlp";

const MODES: { key: EntryMode; label: string; icon: typeof ClipboardList }[] = [
  { key: "structured", label: "Form", icon: ClipboardList },
  { key: "paste", label: "Paste Chat", icon: MessageSquare },
  { key: "nlp", label: "Natural Language", icon: Sparkles },
];

export default function OrderTicket() {
  const [mode, setMode] = useState<EntryMode>("structured");
  const [formData, setFormData] = useState<OrderFormData>(EMPTY_ORDER);
  const [confidences, setConfidences] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  function handleParsed(data: Partial<OrderFormData>, conf: Record<string, number>) {
    setFormData((prev) => ({ ...prev, ...data }));
    setConfidences(conf);
    // Switch to structured view so user can review parsed fields
    setMode("structured");
  }

  function handleSubmit() {
    // TODO: POST to /api/v1/orders when endpoint is ready
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  function handleReset() {
    setFormData(EMPTY_ORDER);
    setConfidences({});
    setSubmitted(false);
  }

  const canSubmit =
    formData.side && formData.instrument && formData.quantity;

  return (
    <Card>
      {/* Mode tabs */}
      <div className="flex border-b border-slate-200 -mx-4 -mt-4 mb-4 px-4">
        {MODES.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
              mode === key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700",
            )}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Entry area based on mode */}
      <div className="mb-4">
        {mode === "structured" && (
          <StructuredOrderForm
            data={formData}
            onChange={setFormData}
            confidences={Object.keys(confidences).length > 0 ? confidences : undefined}
          />
        )}
        {mode === "paste" && <ChatPasteEntry onParsed={handleParsed} />}
        {mode === "nlp" && <NLPOrderEntry onParsed={handleParsed} />}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Order
        </button>
        <button
          onClick={handleReset}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Clear
        </button>
        {submitted && (
          <span className="text-sm text-green-600 font-medium">
            Order submitted for review.
          </span>
        )}
      </div>
    </Card>
  );
}
