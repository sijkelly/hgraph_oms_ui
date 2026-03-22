import type { Portfolio, Book } from "@/api/types";
import Card from "@/components/shared/Card";
import StatusBadge from "@/components/shared/StatusBadge";
import { X, ChevronRight } from "lucide-react";

interface PortfolioDetailProps {
  portfolio: Portfolio;
  books: Book[];
  onClose: () => void;
}

export default function PortfolioDetail({
  portfolio,
  books,
  onClose,
}: PortfolioDetailProps) {
  const portfolioBooks = books.filter(
    (b) => b.portfolio_symbol === portfolio.symbol,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{portfolio.name}</h2>
          <p className="text-sm text-slate-500">{portfolio.symbol}</p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
      </div>

      <Card title="Portfolio Information">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <Field label="Type" value={portfolio.portfolio_type} />
          <Field label="Owner" value={portfolio.owner} />
          <Field label="Base Currency" value={portfolio.base_currency} />
          <Field label="Legal Entity" value={portfolio.legal_entity_symbol ?? "—"} />
          <div>
            <dt className="text-xs font-medium text-slate-500">Status</dt>
            <dd className="mt-0.5">
              <StatusBadge status={portfolio.status} />
            </dd>
          </div>
        </div>
      </Card>

      <Card title={`Books (${portfolioBooks.length})`}>
        {portfolioBooks.length === 0 ? (
          <p className="text-sm text-slate-500">No books assigned to this portfolio.</p>
        ) : (
          <div className="space-y-2">
            {portfolioBooks.map((book) => (
              <div
                key={book.symbol}
                className="flex items-center gap-3 rounded border border-slate-100 p-3 hover:bg-slate-50"
              >
                <ChevronRight size={14} className="text-slate-400" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-slate-900">
                      {book.symbol}
                    </span>
                    <StatusBadge status={book.status} />
                  </div>
                  <p className="text-xs text-slate-500 truncate">{book.name}</p>
                </div>
                <div className="text-xs text-slate-500 text-right">
                  <div>{book.book_type}</div>
                  <div>{book.owner}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
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
