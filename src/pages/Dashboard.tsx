import { useCreditLimits, useCreditUtilizations, useEntities, usePortfolios } from "@/api/hooks";
import Card from "@/components/shared/Card";
import CreditSummary from "@/components/credit/CreditSummary";
import { formatCurrency } from "@/lib/utils";

export default function Dashboard() {
  const { data: limits } = useCreditLimits();
  const { data: utilizations } = useCreditUtilizations();
  const { data: entities } = useEntities();
  const { data: portfolios } = usePortfolios();

  const totalLimitAmount = (limits ?? []).reduce((s, l) => s + l.limit_amount, 0);
  const activeLimits = (limits ?? []).filter((l) => l.status === "Active").length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>

      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="text-xs uppercase text-slate-500 font-medium mb-1">
            Total Credit Limits
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatCurrency(totalLimitAmount)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {activeLimits} active
          </div>
        </Card>

        <Card>
          <div className="text-xs uppercase text-slate-500 font-medium mb-1">
            Counterparties
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {entities?.length ?? 0}
          </div>
        </Card>

        <Card>
          <div className="text-xs uppercase text-slate-500 font-medium mb-1">
            Portfolios
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {portfolios?.length ?? 0}
          </div>
        </Card>

        <Card>
          <div className="text-xs uppercase text-slate-500 font-medium mb-1">
            Utilization Alerts
          </div>
          <div className="text-2xl font-bold text-red-600">
            {(utilizations ?? []).filter((u) => u.utilization_percentage >= 75).length}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            75%+ utilization
          </div>
        </Card>
      </div>

      {/* Utilization overview */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">
          Credit Utilization Overview
        </h2>
        <CreditSummary utilizations={utilizations ?? []} />
      </section>
    </div>
  );
}
