import { useState, useMemo } from "react";
import { usePortfolios, useBooks } from "@/api/hooks";
import type { Portfolio } from "@/api/types";
import Card from "@/components/shared/Card";
import StatusBadge from "@/components/shared/StatusBadge";
import PortfolioDetail from "@/components/portfolios/PortfolioDetail";
import { Search } from "lucide-react";

export default function PortfoliosPage() {
  const { data: portfolios, isLoading: pfLoading } = usePortfolios();
  const { data: books, isLoading: bkLoading } = useBooks();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Portfolio | null>(null);

  const filteredPortfolios = useMemo(() => {
    if (!portfolios) return [];
    if (!search) return portfolios;
    const q = search.toLowerCase();
    return portfolios.filter(
      (p) =>
        p.symbol.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.owner.toLowerCase().includes(q),
    );
  }, [portfolios, search]);

  const filteredBooks = useMemo(() => {
    if (!books) return [];
    if (!search) return books;
    const q = search.toLowerCase();
    return books.filter(
      (b) =>
        b.symbol.toLowerCase().includes(q) ||
        b.name.toLowerCase().includes(q) ||
        b.portfolio_symbol.toLowerCase().includes(q),
    );
  }, [books, search]);

  if (selected) {
    return (
      <PortfolioDetail
        portfolio={selected}
        books={books ?? []}
        onClose={() => setSelected(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Portfolios & Books</h1>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border border-slate-300 pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <Card title={`Portfolios (${filteredPortfolios.length})`}>
        {pfLoading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : filteredPortfolios.length === 0 ? (
          <p className="text-sm text-slate-500">
            {search ? "No portfolios match your search." : "No portfolios found."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <th className="px-4 py-3">Symbol</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Entity</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPortfolios.map((p) => (
                  <tr
                    key={p.symbol}
                    onClick={() => setSelected(p)}
                    className="hover:bg-slate-50 cursor-pointer"
                  >
                    <td className="px-4 py-3 font-medium text-blue-600">{p.symbol}</td>
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3">{p.portfolio_type}</td>
                    <td className="px-4 py-3">{p.owner}</td>
                    <td className="px-4 py-3">{p.legal_entity_symbol ?? "—"}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title={`Books (${filteredBooks.length})`}>
        {bkLoading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : filteredBooks.length === 0 ? (
          <p className="text-sm text-slate-500">
            {search ? "No books match your search." : "No books found."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <th className="px-4 py-3">Symbol</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Portfolio</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBooks.map((b) => (
                  <tr key={b.symbol} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{b.symbol}</td>
                    <td className="px-4 py-3">{b.name}</td>
                    <td className="px-4 py-3">{b.book_type}</td>
                    <td className="px-4 py-3">{b.owner}</td>
                    <td className="px-4 py-3">{b.portfolio_symbol}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status} />
                    </td>
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
