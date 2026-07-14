import { parseDateToYyyyMmDd } from '@/lib/utils';

export function yearToDateRange(today: Date) {
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  return {
    from: parseDateToYyyyMmDd(oneYearAgo),
    to: parseDateToYyyyMmDd(today),
  };
}
