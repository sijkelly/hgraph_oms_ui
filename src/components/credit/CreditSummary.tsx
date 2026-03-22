import type { CreditUtilization } from "@/api/types";
import Card from "@/components/shared/Card";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface CreditSummaryProps {
  utilizations: CreditUtilization[];
}

function utilizationColor(pct: number): string {
  if (pct >= 90) return "text-red-600";
  if (pct >= 75) return "text-amber-600";
  return "text-green-600";
}

export default function CreditSummary({ utilizations }: CreditSummaryProps) {
  if (utilizations.length === 0) {
    return (
      <Card title="Credit Utilization">
        <p className="text-sm text-slate-500">No utilization data available.</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {utilizations.map((u) => (
        <Card key={u.counterparty_symbol} title={u.counterparty_symbol}>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Utilized</span>
              <span className="font-medium">
                {formatCurrency(u.utilized_amount, u.utilization_currency)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Available</span>
              <span className="font-medium">
                {formatCurrency(u.available_amount, u.utilization_currency)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Limit</span>
              <span className="font-medium">
                {formatCurrency(u.limit_amount, u.utilization_currency)}
              </span>
            </div>

            {/* Utilization bar */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">Utilization</span>
                <span className={utilizationColor(u.utilization_percentage)}>
                  {formatPercent(u.utilization_percentage)}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    u.utilization_percentage >= 90
                      ? "bg-red-500"
                      : u.utilization_percentage >= 75
                        ? "bg-amber-500"
                        : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(u.utilization_percentage, 100)}%` }}
                />
              </div>
            </div>

            <div className="text-xs text-slate-400">
              As of {new Date(u.as_of_timestamp).toLocaleString()}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
