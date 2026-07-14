import { createMockServiceLogDto } from '@/lib/jest/mock/src/module/car/service-log/application/dto/service-log';

import { sumServiceLogCosts } from './sum-service-log-costs';

describe('sumServiceLogCosts', () => {
  it('returns 0 for an empty list', () => {
    expect(sumServiceLogCosts([])).toBe(0);
  });

  it('sums all service log costs when no range is given', () => {
    const serviceLogs = [
      createMockServiceLogDto({ serviceCost: 100, serviceDate: '2026-01-01' }),
      createMockServiceLogDto({ serviceCost: 200, serviceDate: '2025-06-01' }),
      createMockServiceLogDto({ serviceCost: 50, serviceDate: '2024-03-01' }),
    ];

    expect(sumServiceLogCosts(serviceLogs)).toBe(350);
  });

  it('treats null serviceCost as excluded from the sum', () => {
    const serviceLogs = [
      createMockServiceLogDto({ serviceCost: 100, serviceDate: '2026-01-01' }),
      createMockServiceLogDto({ serviceCost: null, serviceDate: '2026-01-02' }),
    ];

    expect(sumServiceLogCosts(serviceLogs)).toBe(100);
  });

  it('treats undefined serviceCost as excluded from the sum', () => {
    const serviceLogs = [
      createMockServiceLogDto({ serviceCost: 100, serviceDate: '2026-01-01' }),
      createMockServiceLogDto({
        serviceCost: undefined,
        serviceDate: '2026-01-02',
      }),
    ];

    expect(sumServiceLogCosts(serviceLogs)).toBe(100);
  });

  it('sums only logs within the given range', () => {
    const serviceLogs = [
      createMockServiceLogDto({ serviceCost: 100, serviceDate: '2026-03-05' }),
      createMockServiceLogDto({ serviceCost: 200, serviceDate: '2026-03-10' }),
      createMockServiceLogDto({ serviceCost: 999, serviceDate: '2026-02-01' }),
    ];

    expect(
      sumServiceLogCosts(serviceLogs, { from: '2026-03-01', to: '2026-03-31' }),
    ).toBe(300);
  });

  it('includes logs on the range boundary dates', () => {
    const serviceLogs = [
      createMockServiceLogDto({ serviceCost: 100, serviceDate: '2026-03-01' }),
      createMockServiceLogDto({ serviceCost: 200, serviceDate: '2026-03-31' }),
    ];

    expect(
      sumServiceLogCosts(serviceLogs, { from: '2026-03-01', to: '2026-03-31' }),
    ).toBe(300);
  });

  it('returns 0 when no logs fall within the range', () => {
    const serviceLogs = [
      createMockServiceLogDto({ serviceCost: 100, serviceDate: '2026-01-01' }),
    ];

    expect(
      sumServiceLogCosts(serviceLogs, { from: '2026-03-01', to: '2026-03-31' }),
    ).toBe(0);
  });
});
