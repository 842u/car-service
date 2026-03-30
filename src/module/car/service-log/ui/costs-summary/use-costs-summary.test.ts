import { renderHook } from '@testing-library/react';

import { createMockServiceLog } from '@/lib/jest/mock/src/module/car/service-log';
import { parseDateToYyyyMmDd } from '@/lib/utils';

import { useCostsSummary } from './use-costs-summary';

const MOCK_TODAY = new Date('2026-03-19');
const MOCK_ONE_YEAR_AGO = new Date(
  MOCK_TODAY.getFullYear() - 1,
  MOCK_TODAY.getMonth(),
  MOCK_TODAY.getDate(),
);

const TODAY_STR = parseDateToYyyyMmDd(MOCK_TODAY);
const ONE_YEAR_AGO_STR = parseDateToYyyyMmDd(MOCK_ONE_YEAR_AGO);

const WITHIN_PAST_YEAR = '2025-06-01';
const OUTSIDE_PAST_YEAR = '2024-03-01';

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(MOCK_TODAY);
});

afterEach(() => {
  jest.useRealTimers();
});

describe('useCostsSummary', () => {
  describe('when serviceLogs is undefined', () => {
    it('should return undefined summary', () => {
      const { result } = renderHook(() =>
        useCostsSummary({ serviceLogs: undefined }),
      );

      expect(result.current.summary).toBeUndefined();
    });
  });

  describe('totalCost', () => {
    it('should return 0 when service logs are empty', () => {
      const { result } = renderHook(() => useCostsSummary({ serviceLogs: [] }));

      expect(result.current.summary?.totalCost).toBe(0);
    });

    it('should sum all service log costs', () => {
      const logs = [
        createMockServiceLog({ service_cost: 100, service_date: '2026-01-01' }),
        createMockServiceLog({
          service_cost: 200,
          service_date: WITHIN_PAST_YEAR,
        }),
        createMockServiceLog({
          service_cost: 50,
          service_date: OUTSIDE_PAST_YEAR,
        }),
      ];

      const { result } = renderHook(() =>
        useCostsSummary({ serviceLogs: logs }),
      );

      expect(result.current.summary?.totalCost).toBe(350);
    });

    it('should treat null service_cost as 0', () => {
      const logs = [
        createMockServiceLog({ service_cost: 100, service_date: '2026-01-01' }),
        createMockServiceLog({
          service_cost: null,
          service_date: '2026-01-02',
        }),
      ];

      const { result } = renderHook(() =>
        useCostsSummary({ serviceLogs: logs }),
      );

      expect(result.current.summary?.totalCost).toBe(100);
    });
  });

  describe('yearToDateCost', () => {
    it('should return 0 when service logs are empty', () => {
      const { result } = renderHook(() => useCostsSummary({ serviceLogs: [] }));

      expect(result.current.summary?.yearToDateCost).toBe(0);
    });

    it('should sum only logs within the past year', () => {
      const logs = [
        createMockServiceLog({ service_cost: 100, service_date: '2026-01-01' }),
        createMockServiceLog({
          service_cost: 200,
          service_date: WITHIN_PAST_YEAR,
        }),
        createMockServiceLog({
          service_cost: 999,
          service_date: OUTSIDE_PAST_YEAR,
        }),
      ];

      const { result } = renderHook(() =>
        useCostsSummary({ serviceLogs: logs }),
      );

      expect(result.current.summary?.yearToDateCost).toBe(300);
    });

    it('should include logs on boundary dates', () => {
      const logs = [
        createMockServiceLog({
          service_cost: 100,
          service_date: ONE_YEAR_AGO_STR,
        }),
        createMockServiceLog({ service_cost: 200, service_date: TODAY_STR }),
      ];

      const { result } = renderHook(() =>
        useCostsSummary({ serviceLogs: logs }),
      );

      expect(result.current.summary?.yearToDateCost).toBe(300);
    });

    it('should exclude logs outside boundary dates', () => {
      const logs = [
        createMockServiceLog({
          service_cost: 999,
          service_date: OUTSIDE_PAST_YEAR,
        }),
        createMockServiceLog({
          service_cost: 100,
          service_date: WITHIN_PAST_YEAR,
        }),
      ];

      const { result } = renderHook(() =>
        useCostsSummary({ serviceLogs: logs }),
      );

      expect(result.current.summary?.yearToDateCost).toBe(100);
    });
  });
});
