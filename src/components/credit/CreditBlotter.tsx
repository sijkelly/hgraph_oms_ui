import { useEffect, useRef } from "react";
import type { Client, Table } from "@finos/perspective";
import type { HTMLPerspectiveViewerElement } from "@finos/perspective-viewer";
import type { CreditLimit } from "@/api/types";

interface CreditBlotterProps {
  limits: CreditLimit[];
}

export default function CreditBlotter({ limits }: CreditBlotterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLElement | null>(null);
  const tableRef = useRef<Table | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const perspective = await import("@finos/perspective");
      const container = containerRef.current;
      if (!container || cancelled) return;

      // Create worker and table
      const worker = await perspective.default.websocket("");
      // Fallback: use the default worker if websocket fails
      let worker2: Client;
      try {
        worker2 = await perspective.default.worker();
      } catch {
        worker2 = worker;
      }

      // A column-type schema; Perspective's typings only describe row or column data here
      const schema = {
        counterparty_symbol: "string",
        limit_type: "string",
        limit_amount: "float",
        limit_currency: "string",
        effective_date: "string",
        expiry_date: "string",
        status: "string",
        approved_by: "string",
      } as unknown as Record<string, unknown[]>;
      const table = await worker2.table(schema, { name: "credit_limits" });

      if (cancelled) {
        table.delete();
        return;
      }

      tableRef.current = table;

      // Create viewer element
      await import("@finos/perspective-viewer");
      await import("@finos/perspective-viewer-datagrid");
      await import("@finos/perspective-viewer-d3fc");

      if (cancelled) return;

      const viewer = document.createElement("perspective-viewer") as HTMLPerspectiveViewerElement;
      container.appendChild(viewer);
      viewerRef.current = viewer;

      await viewer.load(table);

      // Load initial data
      if (limits.length > 0) {
        await table.update(limits.map(serializeRow));
      }
    }

    init().catch(console.error);

    return () => {
      cancelled = true;
      if (viewerRef.current) {
        viewerRef.current.remove();
        viewerRef.current = null;
      }
      if (tableRef.current) {
        tableRef.current.delete();
        tableRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update data when limits change
  useEffect(() => {
    if (tableRef.current && limits.length > 0) {
      tableRef.current.replace(limits.map(serializeRow));
    }
  }, [limits]);

  return (
    <div
      ref={containerRef}
      className="h-[500px] w-full border border-slate-200 rounded-lg overflow-hidden"
    />
  );
}

function serializeRow(cl: CreditLimit) {
  return {
    counterparty_symbol: cl.counterparty_symbol,
    limit_type: cl.limit_type,
    limit_amount: cl.limit_amount,
    limit_currency: cl.limit_currency,
    effective_date: cl.effective_date ?? "",
    expiry_date: cl.expiry_date ?? "",
    status: cl.status,
    approved_by: cl.approved_by ?? "",
  };
}
