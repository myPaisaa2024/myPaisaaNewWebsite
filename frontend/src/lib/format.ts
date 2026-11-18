// Shared number formatting — Indian digit grouping (1,00,000) and lakh/crore labels.
const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function formatINR(value: number): string {
  return inr.format(value);
}

/** 100000 → "₹1 Lakh", 300000 → "₹3 Lakhs", 10000000 → "₹1 Cr" */
export function formatLakhLabel(value: number): string {
  if (value >= 10000000 && value % 10000000 === 0) {
    return `₹${value / 10000000} Cr`;
  }
  if (value % 100000 === 0) {
    return `₹${value / 100000} Lakh${value === 100000 ? "" : "s"}`;
  }
  return `₹${inr.format(value)}`;
}

/** Compact chip label for sliders/pickers: 100000 → "₹1L", 2500000 → "₹25L" */
export function formatShort(value: number): string {
  return `₹${value / 100000}L`;
}
