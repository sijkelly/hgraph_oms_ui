import { useEntities, useRelationships } from "@/api/hooks";
import Card from "@/components/shared/Card";

export default function PartiesPage() {
  const { data: entities, isLoading: entLoading } = useEntities();
  const { data: relationships, isLoading: relLoading } = useRelationships();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Counterparties</h1>

      <Card title="Legal Entities">
        {entLoading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : !entities?.length ? (
          <p className="text-sm text-slate-500">No entities found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <th className="px-4 py-3">Symbol</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Classification</th>
                  <th className="px-4 py-3">LEI</th>
                  <th className="px-4 py-3">Jurisdiction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entities.map((e) => (
                  <tr key={e.symbol} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{e.symbol}</td>
                    <td className="px-4 py-3">{e.name}</td>
                    <td className="px-4 py-3">{e.classification}</td>
                    <td className="px-4 py-3 font-mono text-xs">{e.lei ?? "—"}</td>
                    <td className="px-4 py-3">{e.jurisdiction ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title="Trading Relationships">
        {relLoading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : !relationships?.length ? (
          <p className="text-sm text-slate-500">No relationships found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <th className="px-4 py-3">Internal</th>
                  <th className="px-4 py-3">External</th>
                  <th className="px-4 py-3">Clearing</th>
                  <th className="px-4 py-3">ISDA</th>
                  <th className="px-4 py-3">Portfolio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {relationships.map((r) => (
                  <tr
                    key={`${r.internal_party_symbol}-${r.external_party_symbol}`}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {r.internal_party_symbol}
                    </td>
                    <td className="px-4 py-3">{r.external_party_symbol}</td>
                    <td className="px-4 py-3">{r.clearing_status}</td>
                    <td className="px-4 py-3">
                      {r.isda
                        ? `${r.isda.agreement_type} ${r.isda.version ?? ""}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3">{r.internal_portfolio ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
