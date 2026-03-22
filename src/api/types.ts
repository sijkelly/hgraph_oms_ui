/** API response types matching the FastAPI Pydantic schemas. */

export interface CreditLimit {
  counterparty_symbol: string;
  limit_type: string;
  limit_amount: number;
  limit_currency: string;
  effective_date: string | null;
  expiry_date: string | null;
  status: string;
  approved_by: string | null;
  last_review_date: string | null;
}

export interface CreditUtilization {
  counterparty_symbol: string;
  utilized_amount: number;
  utilization_currency: string;
  limit_amount: number;
  available_amount: number;
  utilization_percentage: number;
  as_of_timestamp: string;
}

export interface LegalEntity {
  symbol: string;
  name: string;
  classification: string;
  lei: string | null;
  jurisdiction: string | null;
}

export interface MasterAgreement {
  agreement_type: string;
  version: string | null;
  credit_support_annex: boolean;
  governing_law: string | null;
  threshold_amount: number | null;
  minimum_transfer_amount: number | null;
}

export interface TradingRelationship {
  internal_party_symbol: string;
  external_party_symbol: string;
  clearing_status: string;
  isda: MasterAgreement | null;
  dropcopy_enabled: boolean;
  internal_portfolio: string | null;
}

export interface Portfolio {
  symbol: string;
  name: string;
  portfolio_type: string;
  owner: string;
  base_currency: string;
  legal_entity_symbol: string | null;
  status: string;
}

export interface Book {
  symbol: string;
  name: string;
  book_type: string;
  owner: string;
  base_currency: string;
  portfolio_symbol: string;
  status: string;
}

export type OrderStatus =
  | "Pending"
  | "Working"
  | "Filled"
  | "Partially Filled"
  | "Rejected"
  | "Cancelled";

export interface Order {
  order_id: string;
  instrument: string;
  side: string;
  quantity: string;
  unit: string;
  price: string;
  counterparty: string;
  delivery_period: string;
  order_type: string;
  portfolio: string;
  book: string;
  status: OrderStatus;
  filled_quantity: string;
  created_at: string;
  updated_at: string;
}

export interface OrderField {
  value: string;
  confidence: number;
}

export interface NLPParseResponse {
  instrument?: OrderField;
  side?: OrderField;
  quantity?: OrderField;
  unit?: OrderField;
  price?: OrderField;
  counterparty?: OrderField;
  delivery_period?: OrderField;
  order_type?: OrderField;
  portfolio?: OrderField;
  book?: OrderField;
  notes?: string;
  raw_text: string;
}
