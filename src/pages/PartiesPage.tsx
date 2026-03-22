import { useState, useMemo } from "react";
import { useEntities, useRelationships, useCreditLimits, useCreditUtilizations } from "@/api/hooks";
import type { LegalEntity } from "@/api/types";
import Card from "@/components/shared/Card";
import EntityDetail from "@/components/parties/EntityDetail";
import { Search } from "lucide-react";

export default function PartiesPage() {
  const { data: entities, isLoading: entLoading } = useEntities();
  const { data: relationships } = useRelationships();
  const { data: limits } = useCreditLimits();
  const { data: utilizations } = useCreditUtilizations();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<LegalEntity | null>(null);

  const filtered = useMemo(() => {
    if (!entities) return [];
    if (!search) return entities;
    const q = search.toLowerCase();
    return entities.filter(
      (e) =>
        e.symbol.toLowerCase().includes(q) ||
        e.name.toLowerCase().includes(q) ||
        (e.lei && e.lei.toLowerCase().includes(q)),
    );
  }, [entities, search]);

  if (selected) {
    const util = (utilizations ?? []).find(
      (u) => u.counterparty_symbol === selected.symbol,
    );
    return (
      <EntityDetail
        entity={selected}
        relationships={relationships ?? []}
        limits={limits ?? []}
        utilization={util}
        onClose={() => setSelected(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Counterparties</h1>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search entities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border border-slate-300 pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <Card title={`Legal Entities (${filtered.length})`}>
        {entLoading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-slate-500">
            {search ? "No entities match your search." : "No entities found."}
          </p>
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
                {filtered.map((e) => (
                  <tr
                    key={e.symbol}
                    onClick={() => setSelected(e)}
                    className="hover:bg-slate-50 cursor-pointer"
                  >
                    <td className="px-4 py-3 font-medium text-blue-600">{e.symbol}</td>
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
    </div>
  );
}
