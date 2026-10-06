const compactFormatter = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

/**
 * Formats a number in short notation for the UI: 999 → "999", 1234 → "1.2K",
 * 1_200_000 → "1.2M", 3.4e9 → "3.4B".
 */
export function compact(value: number): string {
  return compactFormatter.format(value);
}
