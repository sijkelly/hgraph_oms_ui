/**
 * React Query hooks for all API endpoints.
 */

import { useMutation, useQuery } from "@tanstack/react-query";
import { get, post } from "./client";
import type {
  CreditLimit,
  CreditUtilization,
  LegalEntity,
  TradingRelationship,
  Portfolio,
  Book,
  NLPParseResponse,
  UserEntitlements,
  PermissionCheck,
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

export function useEntity(symbol: string) {
  return useQuery({
    queryKey: ["entity", symbol],
    queryFn: () => get<LegalEntity>(`/api/v1/parties/entities/${encodeURIComponent(symbol)}`),
    enabled: !!symbol,
  });
}

export function useRelationships() {
  return useQuery({
    queryKey: ["relationships"],
    queryFn: () => get<TradingRelationship[]>("/api/v1/parties/relationships"),
  });
}

export function useRelationship(internal: string, external: string) {
  return useQuery({
    queryKey: ["relationship", internal, external],
    queryFn: () =>
      get<TradingRelationship>(
        `/api/v1/parties/relationships/${encodeURIComponent(internal)}/${encodeURIComponent(external)}`,
      ),
    enabled: !!internal && !!external,
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

export function usePortfolio(symbol: string) {
  return useQuery({
    queryKey: ["portfolio", symbol],
    queryFn: () => get<Portfolio>(`/api/v1/portfolios/${encodeURIComponent(symbol)}`),
    enabled: !!symbol,
  });
}

export function useBooks() {
  return useQuery({
    queryKey: ["books"],
    queryFn: () => get<Book[]>("/api/v1/books"),
  });
}

export function useBook(symbol: string) {
  return useQuery({
    queryKey: ["book", symbol],
    queryFn: () => get<Book>(`/api/v1/books/${encodeURIComponent(symbol)}`),
    enabled: !!symbol,
  });
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Entitlements
// ---------------------------------------------------------------------------

export function useUserEntitlements(userId: string) {
  return useQuery({
    queryKey: ["entitlements", userId],
    queryFn: () => get<UserEntitlements>(`/api/v1/entitlements/${encodeURIComponent(userId)}`),
    enabled: !!userId,
    retry: false,
  });
}

export function usePermissionCheck(userId: string, action: string) {
  return useQuery({
    queryKey: ["permission", userId, action],
    queryFn: () =>
      get<PermissionCheck>(
        `/api/v1/entitlements/${encodeURIComponent(userId)}/check/${encodeURIComponent(action)}`,
      ),
    enabled: !!userId && !!action,
  });
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export function useParseNLP() {
  return useMutation({
    mutationFn: (params: { text: string; context?: string }) =>
      post<NLPParseResponse>("/api/v1/orders/parse-nlp", params),
  });
}
