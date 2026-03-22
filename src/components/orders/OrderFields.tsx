/**
 * Shared order field state and types used across all three entry modes.
 */

export interface OrderFormData {
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
  notes: string;
}

export const EMPTY_ORDER: OrderFormData = {
  instrument: "",
  side: "",
  quantity: "",
  unit: "",
  price: "",
  counterparty: "",
  delivery_period: "",
  order_type: "Limit",
  portfolio: "",
  book: "",
  notes: "",
};

export const SIDE_OPTIONS = ["Buy", "Sell"];
export const ORDER_TYPE_OPTIONS = ["Limit", "Market"];
export const UNIT_OPTIONS = ["MMBtu", "MWh", "lots", "contracts", "barrels"];
