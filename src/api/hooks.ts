/**
 * React Query hooks for all API endpoints.
 */

import { useQuery } from "@tanstack/react-query";
import { get } from "./client";
import type {
  CreditLimit,
  CreditUtilization,
  LegalEntity,
  TradingRelationship,
  Portfolio,
  Book,
} from "./types";

// ---------------------------------------------------------------------------
// Credit
// ---------------------------------------------------------------------------

export function useCreditLimits(counterparty?: string) {
  const params = counterparty ? `?counterparty=${encodeURIComponent(counterparty)}` : "";
  return useQuery({
    queryKey: ["credit-limits", counterparty ?? "all"],
    queryFn: () => get<CreditLimit[]>(`/api/v1/credit/limits${params}`),
    refetchInterval: 10_000,
  });
}

export function useCreditUtilizations() {
  return useQuery({
    queryKey: ["credit-utilizations"],
    queryFn: () => get<CreditUtilization[]>("/api/v1/credit/utilizations"),
    refetchInterval: 10_000,
  });
}

// ---------------------------------------------------------------------------
// Parties
// ---------------------------------------------------------------------------

export function useEntities() {
  return useQuery({
    queryKey: ["entities"],
    queryFn: () => get<LegalEntity[]>("/api/v1/parties/entities"),
  });
}

export function useRelationships() {
  return useQuery({
    queryKey: ["relationships"],
    queryFn: () => get<TradingRelationship[]>("/api/v1/parties/relationships"),
  });
}

// ---------------------------------------------------------------------------
// Portfolios
// ---------------------------------------------------------------------------

export function usePortfolios() {
  return useQuery({
    queryKey: ["portfolios"],
    queryFn: () => get<Portfolio[]>("/api/v1/portfolios"),
  });
}

export function useBooks() {
  return useQuery({
    queryKey: ["books"],
    queryFn: () => get<Book[]>("/api/v1/books"),
  });
}
