import { humanizeSeconds } from './time';

describe('humanizeSeconds', () => {
  it.each([
    [0, '0s'],
    [45, '45s'],
    [150, '2m 30s'],
    [120, '2m 0s'],
    [11_520, '3h 12m'],
    [90_000, '1d 1h'],
    [-5, '0s'],
    [59.9, '59s'],
  ])('formats %d seconds as %s (short)', (input, expected) => {
    expect(humanizeSeconds(input)).toBe(expected);
  });

  it('supports a long style', () => {
    expect(humanizeSeconds(150, 'long')).toBe('2 minutes 30 seconds');
    expect(humanizeSeconds(1, 'long')).toBe('1 second');
  });
});
