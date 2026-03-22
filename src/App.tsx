import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppShell from "@/components/layout/AppShell";
import Dashboard from "@/pages/Dashboard";
import CreditPage from "@/pages/CreditPage";
import OrdersPage from "@/pages/OrdersPage";
import PartiesPage from "@/pages/PartiesPage";
import PortfoliosPage from "@/pages/PortfoliosPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5_000,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="credit" element={<CreditPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="parties" element={<PartiesPage />} />
            <Route path="portfolios" element={<PortfoliosPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
