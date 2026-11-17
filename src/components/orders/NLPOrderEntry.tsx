import { useCallback, useEffect, useRef, useState } from "react";
import { useParseNLP } from "@/api/hooks";
import type { OrderFormData } from "./OrderFields";
import type { NLPParseResponse, OrderField } from "@/api/types";

interface NLPOrderEntryProps {
  onParsed: (data: Partial<OrderFormData>, confidences: Record<string, number>) => void;
}

function extractField(field: OrderField | undefined): { value: string; confidence: number } | null {
  if (!field) return null;
  return { value: field.value, confidence: field.confidence };
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
    const entry = extractField(parsed[field]);
    if (entry) {
      data[field] = entry.value;
      confidences[field] = entry.confidence;
    }
  }

  if (parsed.notes) data.notes = parsed.notes;
  return { data, confidences };
}

export default function NLPOrderEntry({ onParsed }: NLPOrderEntryProps) {
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<Partial<OrderFormData> | null>(null);
  const parseNLP = useParseNLP();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const doParse = useCallback(
    (value: string) => {
      if (!value.trim() || value.trim().length < 10) {
        setPreview(null);
        return;
      }
      parseNLP.mutate(
        { text: value },
        {
          onSuccess: (result) => {
            const { data, confidences } = toFormData(result);
            setPreview(data);
            onParsed(data, confidences);
          },
        },
      );
    },
    [parseNLP, onParsed],
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doParse(text), 800);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500">
        Type your order in plain English. Fields will be extracted automatically
        as you type.
      </p>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Buy 50,000 MMBtu of Henry Hub gas, January delivery, at $3.45 with ACME"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {parseNLP.isPending && (
        <p className="text-xs text-slate-400">Parsing...</p>
      )}

      {preview && Object.keys(preview).length > 0 && (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-medium text-slate-500 mb-2">Extracted fields:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(preview).map(([key, value]) =>
              value ? (
                <span
                  key={key}
                  className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                >
                  {key}: {value}
                </span>
              ) : null,
            )}
          </div>
        </div>
      )}

      {parseNLP.isError && (
        <p className="text-sm text-red-600">
          {(parseNLP.error as Error).message}
        </p>
      )}
    </div>
  );
}
