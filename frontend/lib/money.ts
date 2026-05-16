export function formatPrice(amountDa: number): string {
  return `${amountDa.toLocaleString('ar-DZ')} دج`;
}

export function formatPriceCompact(amountDa: number): string {
  return `${amountDa.toLocaleString('ar-DZ')} دج`;
}

export function calculateSavings(original: number, discounted: number): number {
  return original - discounted;
}

export function calculateSavingsPercent(original: number, discounted: number): number {
  return Math.round(((original - discounted) / original) * 100);
}
