import { usePortfolios, useBooks } from "@/api/hooks";
import Card from "@/components/shared/Card";
import StatusBadge from "@/components/shared/StatusBadge";

export default function PortfoliosPage() {
  const { data: portfolios, isLoading: pfLoading } = usePortfolios();
  const { data: books, isLoading: bkLoading } = useBooks();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Portfolios & Books</h1>

      <Card title="Portfolios">
        {pfLoading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : !portfolios?.length ? (
          <p className="text-sm text-slate-500">No portfolios found.</p>
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
                {portfolios.map((p) => (
                  <tr key={p.symbol} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{p.symbol}</td>
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

      <Card title="Books">
        {bkLoading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : !books?.length ? (
          <p className="text-sm text-slate-500">No books found.</p>
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
                {books.map((b) => (
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
