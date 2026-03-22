import type { LegalEntity, TradingRelationship, CreditLimit, CreditUtilization } from "@/api/types";
import Card from "@/components/shared/Card";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { X } from "lucide-react";

interface EntityDetailProps {
  entity: LegalEntity;
  relationships: TradingRelationship[];
  limits: CreditLimit[];
  utilization?: CreditUtilization;
  onClose: () => void;
}

export default function EntityDetail({
  entity,
  relationships,
  limits,
  utilization,
  onClose,
}: EntityDetailProps) {
  const entityRels = relationships.filter(
    (r) =>
      r.internal_party_symbol === entity.symbol ||
      r.external_party_symbol === entity.symbol,
  );
  const entityLimits = limits.filter(
    (l) => l.counterparty_symbol === entity.symbol,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{entity.name}</h2>
          <p className="text-sm text-slate-500">{entity.symbol}</p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
      </div>

      {/* Entity info */}
      <Card title="Entity Information">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <Field label="Classification" value={entity.classification} />
          <Field label="LEI" value={entity.lei ?? "—"} />
          <Field label="Jurisdiction" value={entity.jurisdiction ?? "—"} />
          <Field label="Symbol" value={entity.symbol} />
        </div>
      </Card>

      {/* Credit summary */}
      {(entityLimits.length > 0 || utilization) && (
        <Card title="Credit">
          <div className="space-y-3">
            {utilization && (
              <div className="flex items-center gap-6 text-sm">
                <span className="text-slate-500">
                  Utilized: <strong>{formatCurrency(utilization.utilized_amount)}</strong>
                </span>
                <span className="text-slate-500">
                  Available: <strong>{formatCurrency(utilization.available_amount)}</strong>
                </span>
                <span
                  className={
                    utilization.utilization_percentage >= 75
                      ? "text-red-600 font-semibold"
                      : "text-green-600 font-semibold"
                  }
                >
                  {formatPercent(utilization.utilization_percentage)}
                </span>
              </div>
            )}
            {entityLimits.length > 0 && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-medium text-slate-500 uppercase">
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2 text-right">Limit</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Expiry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {entityLimits.map((l, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2">{l.limit_type}</td>
                      <td className="px-3 py-2 text-right font-mono">
                        {formatCurrency(l.limit_amount, l.limit_currency)}
                      </td>
                      <td className="px-3 py-2">
                        <StatusBadge status={l.status} />
                      </td>
                      <td className="px-3 py-2 text-slate-500">{l.expiry_date ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      )}

      {/* Relationships */}
      {entityRels.length > 0 && (
        <Card title="Trading Relationships">
          <div className="space-y-3">
            {entityRels.map((r, i) => (
              <div key={i} className="rounded border border-slate-100 p-3 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{r.internal_party_symbol}</span>
                  <span className="text-slate-400">&harr;</span>
                  <span className="font-medium">{r.external_party_symbol}</span>
                  <span className="text-xs text-slate-500 ml-auto">
                    {r.clearing_status}
                  </span>
                </div>
                {r.isda && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-600">
                    <span>ISDA {r.isda.version ?? ""}</span>
                    <span>CSA: {r.isda.credit_support_annex ? "Yes" : "No"}</span>
                    <span>Law: {r.isda.governing_law ?? "—"}</span>
                    <span>Portfolio: {r.internal_portfolio ?? "—"}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-slate-900">{value}</dd>
    </div>
  );
}
