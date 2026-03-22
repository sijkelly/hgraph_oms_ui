import type { CreditLimit } from "@/api/types";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatCurrency } from "@/lib/utils";

interface CreditLimitsTableProps {
  limits: CreditLimit[];
}

export default function CreditLimitsTable({ limits }: CreditLimitsTableProps) {
  if (limits.length === 0) {
    return <p className="text-sm text-slate-500">No credit limits found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
            <th className="px-4 py-3">Counterparty</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3 text-right">Limit</th>
            <th className="px-4 py-3">Currency</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Effective</th>
            <th className="px-4 py-3">Expiry</th>
            <th className="px-4 py-3">Approved By</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {limits.map((cl, i) => (
            <tr key={`${cl.counterparty_symbol}-${cl.limit_type}-${i}`} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-900">
                {cl.counterparty_symbol}
              </td>
              <td className="px-4 py-3">{cl.limit_type}</td>
              <td className="px-4 py-3 text-right font-mono">
                {formatCurrency(cl.limit_amount, cl.limit_currency)}
              </td>
              <td className="px-4 py-3">{cl.limit_currency}</td>
              <td className="px-4 py-3">
                <StatusBadge status={cl.status} />
              </td>
              <td className="px-4 py-3 text-slate-500">{cl.effective_date ?? "—"}</td>
              <td className="px-4 py-3 text-slate-500">{cl.expiry_date ?? "—"}</td>
              <td className="px-4 py-3 text-slate-500">{cl.approved_by ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
