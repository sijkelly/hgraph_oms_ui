import { useState } from "react";
import { useParseNLP } from "@/api/hooks";
import type { OrderFormData } from "./OrderFields";
import type { NLPParseResponse } from "@/api/types";

interface ChatPasteEntryProps {
  onParsed: (data: Partial<OrderFormData>, confidences: Record<string, number>) => void;
}

function toFormData(parsed: NLPParseResponse): {
  data: Partial<OrderFormData>;
  confidences: Record<string, number>;
} {
  const data: Partial<OrderFormData> = {};
  const confidences: Record<string, number> = {};

  const fields = [
    "instrument", "side", "quantity", "unit", "price",
    "counterparty", "delivery_period", "order_type", "portfolio", "book",
  ] as const;

  for (const field of fields) {
    const entry = parsed[field];
    if (entry) {
      data[field] = entry.value;
      confidences[field] = entry.confidence;
    }
  }

  if (parsed.notes) {
    data.notes = parsed.notes;
  }

  return { data, confidences };
}

export default function ChatPasteEntry({ onParsed }: ChatPasteEntryProps) {
  const [text, setText] = useState("");
  const parseNLP = useParseNLP();

  function handleParse() {
    if (!text.trim()) return;
    parseNLP.mutate(
      { text },
      {
        onSuccess: (result) => {
          const { data, confidences } = toFormData(result);
          onParsed(data, confidences);
        },
      },
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500">
        Paste a client chat message, email, or Bloomberg message below. Claude
        will extract the order fields for your review.
      </p>
      <textarea
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`e.g.\n"Hey, can you buy 50k MMBtu of HH gas for Jan delivery at $3.45? This is for ACME account."`}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex items-center gap-3">
        <button
          onClick={handleParse}
          disabled={parseNLP.isPending || !text.trim()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {parseNLP.isPending ? "Parsing..." : "Parse Order"}
        </button>
        {parseNLP.isError && (
          <span className="text-sm text-red-600">
            {(parseNLP.error as Error).message}
          </span>
        )}
      </div>
    </div>
  );
}
