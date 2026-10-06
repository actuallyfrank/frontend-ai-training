import { compact } from './numbers';

describe('compact', () => {
  it.each([
    [0, '0'],
    [999, '999'],
    [1234, '1.2K'],
    [1_200_000, '1.2M'],
    [3.4e9, '3.4B'],
    [0.1, '0.1'],
  ])('formats %d as %s', (input, expected) => {
    expect(compact(input)).toBe(expected);
  });
});
