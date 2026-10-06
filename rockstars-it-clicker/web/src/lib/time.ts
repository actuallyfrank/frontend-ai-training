type DurationStyle = 'short' | 'long';

const UNITS = [
  { short: 'd', long: 'day', seconds: 86_400 },
  { short: 'h', long: 'hour', seconds: 3_600 },
  { short: 'm', long: 'minute', seconds: 60 },
  { short: 's', long: 'second', seconds: 1 },
] as const;

/**
 * Formats a duration using its two largest units.
 * short: 45 → "45s", 150 → "2m 30s", 11_520 → "3h 12m"
 * long:  150 → "2 minutes 30 seconds"
 */
export function humanizeSeconds(totalSeconds: number, style: DurationStyle = 'short'): string {
  let remaining = Math.max(0, Math.floor(totalSeconds));
  const parts: string[] = [];

  for (const unit of UNITS) {
    const amount = Math.floor(remaining / unit.seconds);
    remaining -= amount * unit.seconds;
    if (amount > 0 || (parts.length > 0 && parts.length < 2)) {
      parts.push(
        style === 'short'
          ? `${amount}${unit.short}`
          : `${amount} ${unit.long}${amount === 1 ? '' : 's'}`,
      );
    }
    if (parts.length === 2) break;
  }

  if (parts.length === 0) return style === 'short' ? '0s' : '0 seconds';
  return parts.join(' ');
}
