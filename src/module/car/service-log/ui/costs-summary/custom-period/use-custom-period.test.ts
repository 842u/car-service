import { act, renderHook } from '@testing-library/react';

import { createMockServiceLog } from '@/lib/jest/mock/src/module/car/service-log';
import { parseDateToYyyyMmDd } from '@/lib/utils';

import { useCustomPeriodCostsSummary } from './use-custom-period';

const MOCK_TODAY = new Date('2026-03-19');
const MOCK_FIRST_DAY_OF_MONTH = new Date(
  MOCK_TODAY.getFullYear(),
  MOCK_TODAY.getMonth(),
  1,
);

const TODAY_STR = parseDateToYyyyMmDd(MOCK_TODAY);
const FIRST_DAY_OF_MONTH_STR = parseDateToYyyyMmDd(MOCK_FIRST_DAY_OF_MONTH);

const WITHIN_THIS_MONTH = '2026-03-10';
const BEFORE_THIS_MONTH = '2026-02-01';

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(MOCK_TODAY);
});

afterEach(() => {
  jest.useRealTimers();
});

describe('useCustomPeriodCostsSummary', () => {
  describe('initial state', () => {
    it('should initialize fromDate to first day of current month', () => {
      const { result } = renderHook(() =>
        useCustomPeriodCostsSummary({ serviceLogs: [] }),
      );

      expect(result.current.fromDate).toBe(FIRST_DAY_OF_MONTH_STR);
    });

    it('should initialize toDate to today', () => {
      const { result } = renderHook(() =>
        useCustomPeriodCostsSummary({ serviceLogs: [] }),
      );

      expect(result.current.toDate).toBe(TODAY_STR);
    });
  });

  describe('date state', () => {
    it('should update fromDate when setFromDate is called', () => {
      const { result } = renderHook(() =>
        useCustomPeriodCostsSummary({ serviceLogs: [] }),
      );

      act(() => result.current.setFromDate('2026-01-01'));

      expect(result.current.fromDate).toBe('2026-01-01');
    });

    it('should update toDate when setToDate is called', () => {
      const { result } = renderHook(() =>
        useCustomPeriodCostsSummary({ serviceLogs: [] }),
      );

      act(() => result.current.setToDate('2026-12-31'));

      expect(result.current.toDate).toBe('2026-12-31');
    });
  });

  describe('costs calculation', () => {
    it('should return undefined costs when serviceLogs is undefined', () => {
      const { result } = renderHook(() =>
        useCustomPeriodCostsSummary({ serviceLogs: undefined }),
      );

      expect(result.current.costs).toBeUndefined();
    });

    it('should return 0 when service logs are empty', () => {
      const { result } = renderHook(() =>
        useCustomPeriodCostsSummary({ serviceLogs: [] }),
      );

      expect(result.current.costs).toBe(0);
    });

    it('should sum only logs within the default period', () => {
      const logs = [
        createMockServiceLog({ service_cost: 100, service_date: '2026-03-05' }),
        createMockServiceLog({
          service_cost: 200,
          service_date: WITHIN_THIS_MONTH,
        }),
        createMockServiceLog({
          service_cost: 999,
          service_date: BEFORE_THIS_MONTH,
        }),
      ];

      const { result } = renderHook(() =>
        useCustomPeriodCostsSummary({ serviceLogs: logs }),
      );

      expect(result.current.costs).toBe(300);
    });

    it('should include logs on boundary dates', () => {
      const logs = [
        createMockServiceLog({
          service_cost: 100,
          service_date: FIRST_DAY_OF_MONTH_STR,
        }),
        createMockServiceLog({ service_cost: 200, service_date: TODAY_STR }),
      ];

      const { result } = renderHook(() =>
        useCustomPeriodCostsSummary({ serviceLogs: logs }),
      );

      expect(result.current.costs).toBe(300);
    });

    it('should recalculate costs when fromDate changes', () => {
      const logs = [
        createMockServiceLog({
          service_cost: 100,
          service_date: BEFORE_THIS_MONTH,
        }),
        createMockServiceLog({
          service_cost: 200,
          service_date: WITHIN_THIS_MONTH,
        }),
      ];

      const { result } = renderHook(() =>
        useCustomPeriodCostsSummary({ serviceLogs: logs }),
      );

      expect(result.current.costs).toBe(200);

      act(() => result.current.setFromDate(BEFORE_THIS_MONTH));

      expect(result.current.costs).toBe(300);
    });

    it('should recalculate costs when toDate changes', () => {
      const futureDate = '2026-03-25';
      const logs = [
        createMockServiceLog({
          service_cost: 100,
          service_date: WITHIN_THIS_MONTH,
        }),
        createMockServiceLog({ service_cost: 200, service_date: futureDate }),
      ];

      const { result } = renderHook(() =>
        useCustomPeriodCostsSummary({ serviceLogs: logs }),
      );

      expect(result.current.costs).toBe(100);

      act(() => result.current.setToDate('2026-03-31'));

      expect(result.current.costs).toBe(300);
    });

    it('should treat null service_cost as 0', () => {
      const logs = [
        createMockServiceLog({
          service_cost: 100,
          service_date: WITHIN_THIS_MONTH,
        }),
        createMockServiceLog({
          service_cost: null,
          service_date: WITHIN_THIS_MONTH,
        }),
      ];

      const { result } = renderHook(() =>
        useCustomPeriodCostsSummary({ serviceLogs: logs }),
      );

      expect(result.current.costs).toBe(100);
    });
  });
});
