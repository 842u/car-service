import { buildServiceLogDto } from '@/car/service-log/application/dto/service-log.builder';

import { sumServiceLogCosts } from './sum-service-log-costs';

describe('sumServiceLogCosts', () => {
  it('returns 0 for an empty list', () => {
    expect(sumServiceLogCosts([])).toBe(0);
  });

  it('sums all service log costs when no range is given', () => {
    const serviceLogs = [
      buildServiceLogDto({ serviceCost: 100, serviceDate: '2026-01-01' }),
      buildServiceLogDto({ serviceCost: 200, serviceDate: '2025-06-01' }),
      buildServiceLogDto({ serviceCost: 50, serviceDate: '2024-03-01' }),
    ];

    expect(sumServiceLogCosts(serviceLogs)).toBe(350);
  });

  it('treats null serviceCost as excluded from the sum', () => {
    const serviceLogs = [
      buildServiceLogDto({ serviceCost: 100, serviceDate: '2026-01-01' }),
      buildServiceLogDto({ serviceCost: null, serviceDate: '2026-01-02' }),
    ];

    expect(sumServiceLogCosts(serviceLogs)).toBe(100);
  });

  it('treats undefined serviceCost as excluded from the sum', () => {
    const serviceLogs = [
      buildServiceLogDto({ serviceCost: 100, serviceDate: '2026-01-01' }),
      buildServiceLogDto({
        serviceCost: undefined,
        serviceDate: '2026-01-02',
      }),
    ];

    expect(sumServiceLogCosts(serviceLogs)).toBe(100);
  });

  it('sums only logs within the given range', () => {
    const serviceLogs = [
      buildServiceLogDto({ serviceCost: 100, serviceDate: '2026-03-05' }),
      buildServiceLogDto({ serviceCost: 200, serviceDate: '2026-03-10' }),
      buildServiceLogDto({ serviceCost: 999, serviceDate: '2026-02-01' }),
    ];

    expect(
      sumServiceLogCosts(serviceLogs, { from: '2026-03-01', to: '2026-03-31' }),
    ).toBe(300);
  });

  it('includes logs on the range boundary dates', () => {
    const serviceLogs = [
      buildServiceLogDto({ serviceCost: 100, serviceDate: '2026-03-01' }),
      buildServiceLogDto({ serviceCost: 200, serviceDate: '2026-03-31' }),
    ];

    expect(
      sumServiceLogCosts(serviceLogs, { from: '2026-03-01', to: '2026-03-31' }),
    ).toBe(300);
  });

  it('returns 0 when no logs fall within the range', () => {
    const serviceLogs = [
      buildServiceLogDto({ serviceCost: 100, serviceDate: '2026-01-01' }),
    ];

    expect(
      sumServiceLogCosts(serviceLogs, { from: '2026-03-01', to: '2026-03-31' }),
    ).toBe(0);
  });
});
