import { useState } from "react";
import { useCreditLimits, useCreditUtilizations } from "@/api/hooks";
import CreditSummary from "@/components/credit/CreditSummary";
import CreditLimitsTable from "@/components/credit/CreditLimitsTable";
import Card from "@/components/shared/Card";

export default function CreditPage() {
  const [counterparty, setCounterparty] = useState("");
  const { data: limits, isLoading: limitsLoading } = useCreditLimits(
    counterparty || undefined,
  );
  const { data: utilizations, isLoading: utilLoading } = useCreditUtilizations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Credit Dashboard</h1>
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
        {utilLoading ? (
          <p className="text-sm text-slate-500">Loading utilizations...</p>
        ) : (
          <CreditSummary utilizations={utilizations ?? []} />
        )}
      </section>

      {/* Limits table */}
      <Card title="Credit Limits">
        {limitsLoading ? (
          <p className="text-sm text-slate-500">Loading limits...</p>
        ) : (
          <CreditLimitsTable limits={limits ?? []} />
        )}
      </Card>
    </div>
  );
}
