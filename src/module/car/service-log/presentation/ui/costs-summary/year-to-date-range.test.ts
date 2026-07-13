import { yearToDateRange } from './year-to-date-range';

describe('yearToDateRange', () => {
  it('returns today as the upper bound', () => {
    const today = new Date('2026-03-19');

    expect(yearToDateRange(today).to).toBe('2026-03-19');
  });

  it('returns one year before today as the lower bound', () => {
    const today = new Date('2026-03-19');

    expect(yearToDateRange(today).from).toBe('2025-03-19');
  });

  it('handles the leap-day boundary', () => {
    const today = new Date('2024-02-29');

    expect(yearToDateRange(today).from).toBe('2023-03-01');
  });
});
