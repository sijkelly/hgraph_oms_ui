import { useState } from "react";
import { useCreditLimits, useCreditUtilizations } from "@/api/hooks";
import { useCreditWebSocket } from "@/api/useWebSocket";
import type { CreditLimit, CreditUtilization } from "@/api/types";
import CreditSummary from "@/components/credit/CreditSummary";
import CreditLimitsTable from "@/components/credit/CreditLimitsTable";
import Card from "@/components/shared/Card";
import { Wifi, WifiOff } from "lucide-react";

export default function CreditPage() {
  const [counterparty, setCounterparty] = useState("");
  const { data: limits, isLoading: limitsLoading } = useCreditLimits(
    counterparty || undefined,
  );
  const { data: utilizations, isLoading: utilLoading } = useCreditUtilizations();

  // Live WebSocket updates — overrides REST data when available
  const wsLimits = useCreditWebSocket<CreditLimit[]>("credit.limits");
  const wsUtilizations = useCreditWebSocket<CreditUtilization[]>("credit.utilizations");

  const liveLimits = wsLimits ?? limits ?? [];
  const liveUtilizations = wsUtilizations ?? utilizations ?? [];
  const wsConnected = wsLimits !== null || wsUtilizations !== null;

  // Apply counterparty filter to live data
  const filteredLimits = counterparty
    ? liveLimits.filter((l) =>
        l.counterparty_symbol.toLowerCase().includes(counterparty.toLowerCase()),
      )
    : liveLimits;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Credit Dashboard</h1>
          {wsConnected ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              <Wifi size={12} /> Live
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              <WifiOff size={12} /> Polling
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="cp-filter" className="text-sm text-slate-500">
            Counterparty
          </label>
          <input
            id="cp-filter"
            type="text"
            placeholder="Filter..."
            value={counterparty}
            onChange={(e) => setCounterparty(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Utilization summary cards */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Utilization</h2>
        {utilLoading && !wsConnected ? (
          <p className="text-sm text-slate-500">Loading utilizations...</p>
        ) : (
          <CreditSummary utilizations={liveUtilizations} />
        )}
      </section>

      {/* Limits table */}
      <Card title={`Credit Limits (${filteredLimits.length})`}>
        {limitsLoading && !wsConnected ? (
          <p className="text-sm text-slate-500">Loading limits...</p>
        ) : (
          <CreditLimitsTable limits={filteredLimits} />
        )}
      </Card>
    </div>
  );
}
