import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { createMockServiceLog } from '@/lib/jest/mock/src/module/car/service-log';
import { getServiceLogsWithCost } from '@/lib/supabase/tables/service_logs';
import { parseDateToYyyyMmDd } from '@/lib/utils';

import { useCostsSection } from './use-costs';

const mockGetServiceLogsWithCost =
  getServiceLogsWithCost as jest.MockedFunction<typeof getServiceLogsWithCost>;
jest.mock('@/lib/supabase/tables/service_logs');

const mockAddToast = jest.fn();
jest.mock('@/common/presentation/hook/use-toasts', () => ({
  useToasts: () => ({ addToast: mockAddToast }),
}));

const MOCK_TODAY = new Date('2026-03-19');
const MOCK_FIRST_DAY_OF_MONTH = new Date(
  MOCK_TODAY.getFullYear(),
  MOCK_TODAY.getMonth(),
  1,
);
const MOCK_ONE_YEAR_AGO = new Date(
  MOCK_TODAY.getFullYear() - 1,
  MOCK_TODAY.getMonth(),
  MOCK_TODAY.getDate(),
);

const TODAY_STR = parseDateToYyyyMmDd(MOCK_TODAY);
const FIRST_DAY_OF_MONTH_STR = parseDateToYyyyMmDd(MOCK_FIRST_DAY_OF_MONTH);
const ONE_YEAR_AGO_STR = parseDateToYyyyMmDd(MOCK_ONE_YEAR_AGO);
const WITHIN_THIS_MONTH = '2026-03-10';
const WITHIN_PAST_YEAR = '2025-06-01';
const OUTSIDE_PAST_YEAR = '2024-03-01';
const BEFORE_THIS_MONTH = '2026-02-01';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return Wrapper;
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  jest.setSystemTime(MOCK_TODAY);
});

afterEach(() => {
  jest.useRealTimers();
});

describe('useCostsSection', () => {
  describe('initial state', () => {
    it('should return isPending true initially', () => {
      mockGetServiceLogsWithCost.mockReturnValue(new Promise(() => {}));

      const { result } = renderHook(() => useCostsSection(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(true);
    });

    it('should initialize fromDate to first day of current month', () => {
      mockGetServiceLogsWithCost.mockReturnValue(new Promise(() => {}));

      const { result } = renderHook(() => useCostsSection(), {
        wrapper: createWrapper(),
      });

      expect(result.current.fromDate).toBe(FIRST_DAY_OF_MONTH_STR);
    });

    it('should initialize toDate to today', () => {
      mockGetServiceLogsWithCost.mockReturnValue(new Promise(() => {}));

      const { result } = renderHook(() => useCostsSection(), {
        wrapper: createWrapper(),
      });

      expect(result.current.toDate).toBe(TODAY_STR);
    });
  });

  describe('date state', () => {
    it('should update fromDate when setFromDate is called', () => {
      mockGetServiceLogsWithCost.mockResolvedValue([]);

      const { result } = renderHook(() => useCostsSection(), {
        wrapper: createWrapper(),
      });

      act(() => result.current.setFromDate('2026-01-01'));

      expect(result.current.fromDate).toBe('2026-01-01');
    });

    it('should update toDate when setToDate is called', () => {
      mockGetServiceLogsWithCost.mockResolvedValue([]);

      const { result } = renderHook(() => useCostsSection(), {
        wrapper: createWrapper(),
      });

      act(() => result.current.setToDate('2026-12-31'));

      expect(result.current.toDate).toBe('2026-12-31');
    });
  });

  describe('cost calculations', () => {
    it('should calculate totalCost as sum of all service logs', async () => {
      const costA = 100;
      const costB = 200;
      const costC = 50;

      mockGetServiceLogsWithCost.mockResolvedValue([
        createMockServiceLog({
          service_cost: costA,
          service_date: '2026-01-01',
        }),
        createMockServiceLog({
          service_cost: costB,
          service_date: WITHIN_THIS_MONTH,
        }),
        createMockServiceLog({
          service_cost: costC,
          service_date: OUTSIDE_PAST_YEAR,
        }),
      ]);

      const { result } = renderHook(() => useCostsSection(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isPending).toBe(false));

      expect(result.current.data?.totalCost).toBe(costA + costB + costC);
    });

    it('should treat null service_cost as 0 in totalCost', async () => {
      const validCost = 100;

      mockGetServiceLogsWithCost.mockResolvedValue([
        createMockServiceLog({
          service_cost: validCost,
          service_date: WITHIN_THIS_MONTH,
        }),
        createMockServiceLog({
          service_cost: null,
          service_date: WITHIN_THIS_MONTH,
        }),
      ]);

      const { result } = renderHook(() => useCostsSection(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isPending).toBe(false));

      expect(result.current.data?.totalCost).toBe(validCost);
    });

    it('should calculate yearToDateCost for logs within past year', async () => {
      const withinCostA = 100;
      const withinCostB = 200;
      const outsideCost = 999;

      mockGetServiceLogsWithCost.mockResolvedValue([
        createMockServiceLog({
          service_cost: withinCostA,
          service_date: '2026-01-01',
        }),
        createMockServiceLog({
          service_cost: withinCostB,
          service_date: WITHIN_PAST_YEAR,
        }),
        createMockServiceLog({
          service_cost: outsideCost,
          service_date: OUTSIDE_PAST_YEAR,
        }),
      ]);

      const { result } = renderHook(() => useCostsSection(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isPending).toBe(false));

      expect(result.current.data?.yearToDateCost).toBe(
        withinCostA + withinCostB,
      );
    });

    it('should include logs on the yearToDate boundary dates', async () => {
      const boundaryStartCost = 100;
      const boundaryEndCost = 200;

      mockGetServiceLogsWithCost.mockResolvedValue([
        createMockServiceLog({
          service_cost: boundaryStartCost,
          service_date: ONE_YEAR_AGO_STR,
        }),
        createMockServiceLog({
          service_cost: boundaryEndCost,
          service_date: TODAY_STR,
        }),
      ]);

      const { result } = renderHook(() => useCostsSection(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isPending).toBe(false));

      expect(result.current.data?.yearToDateCost).toBe(
        boundaryStartCost + boundaryEndCost,
      );
    });

    it('should exclude logs outside yearToDate boundaries', async () => {
      const outsideCost = 999;
      const withinCost = 100;

      mockGetServiceLogsWithCost.mockResolvedValue([
        createMockServiceLog({
          service_cost: outsideCost,
          service_date: OUTSIDE_PAST_YEAR,
        }),
        createMockServiceLog({
          service_cost: withinCost,
          service_date: WITHIN_PAST_YEAR,
        }),
      ]);

      const { result } = renderHook(() => useCostsSection(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isPending).toBe(false));

      expect(result.current.data?.yearToDateCost).toBe(withinCost);
    });

    it('should calculate filteredCost based on default fromDate and toDate', async () => {
      const withinCostA = 100;
      const withinCostB = 200;
      const outsideCost = 999;

      mockGetServiceLogsWithCost.mockResolvedValue([
        createMockServiceLog({
          service_cost: withinCostA,
          service_date: '2026-03-05',
        }),
        createMockServiceLog({
          service_cost: withinCostB,
          service_date: WITHIN_THIS_MONTH,
        }),
        createMockServiceLog({
          service_cost: outsideCost,
          service_date: BEFORE_THIS_MONTH,
        }),
      ]);

      const { result } = renderHook(() => useCostsSection(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isPending).toBe(false));

      expect(result.current.data?.filteredCost).toBe(withinCostA + withinCostB);
    });

    it('should include logs on the filtered period boundary dates', async () => {
      const boundaryStartCost = 100;
      const boundaryEndCost = 200;

      mockGetServiceLogsWithCost.mockResolvedValue([
        createMockServiceLog({
          service_cost: boundaryStartCost,
          service_date: FIRST_DAY_OF_MONTH_STR,
        }),
        createMockServiceLog({
          service_cost: boundaryEndCost,
          service_date: TODAY_STR,
        }),
      ]);

      const { result } = renderHook(() => useCostsSection(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isPending).toBe(false));

      expect(result.current.data?.filteredCost).toBe(
        boundaryStartCost + boundaryEndCost,
      );
    });

    it('should recalculate filteredCost when fromDate changes', async () => {
      const beforeMonthCost = 100;
      const withinMonthCost = 200;

      mockGetServiceLogsWithCost.mockResolvedValue([
        createMockServiceLog({
          service_cost: beforeMonthCost,
          service_date: BEFORE_THIS_MONTH,
        }),
        createMockServiceLog({
          service_cost: withinMonthCost,
          service_date: WITHIN_THIS_MONTH,
        }),
      ]);

      const { result } = renderHook(() => useCostsSection(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isPending).toBe(false));

      expect(result.current.data?.filteredCost).toBe(withinMonthCost);

      act(() => result.current.setFromDate(BEFORE_THIS_MONTH));

      await waitFor(() =>
        expect(result.current.data?.filteredCost).toBe(
          beforeMonthCost + withinMonthCost,
        ),
      );
    });

    it('should recalculate filteredCost when toDate changes', async () => {
      const futureDate = '2026-03-25';
      const withinCost = 100;
      const futureCost = 200;

      mockGetServiceLogsWithCost.mockResolvedValue([
        createMockServiceLog({
          service_cost: withinCost,
          service_date: WITHIN_THIS_MONTH,
        }),
        createMockServiceLog({
          service_cost: futureCost,
          service_date: futureDate,
        }),
      ]);

      const { result } = renderHook(() => useCostsSection(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isPending).toBe(false));

      expect(result.current.data?.filteredCost).toBe(withinCost);

      act(() => result.current.setToDate('2026-03-31'));

      await waitFor(() =>
        expect(result.current.data?.filteredCost).toBe(withinCost + futureCost),
      );
    });

    it('should return 0 for all costs when service logs are empty', async () => {
      mockGetServiceLogsWithCost.mockResolvedValue([]);

      const { result } = renderHook(() => useCostsSection(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isPending).toBe(false));

      expect(result.current.data?.totalCost).toBe(0);
      expect(result.current.data?.yearToDateCost).toBe(0);
      expect(result.current.data?.filteredCost).toBe(0);
    });
  });

  describe('error handling', () => {
    it('should show error toast when fetch fails', async () => {
      mockGetServiceLogsWithCost.mockRejectedValue(new Error('DB error'));

      renderHook(() => useCostsSection(), { wrapper: createWrapper() });

      await waitFor(() =>
        expect(mockAddToast).toHaveBeenCalledWith('DB error', 'error'),
      );
    });

    it('should fall back to generic message when error has no message', async () => {
      mockGetServiceLogsWithCost.mockRejectedValue(new Error(''));

      renderHook(() => useCostsSection(), { wrapper: createWrapper() });

      await waitFor(() =>
        expect(mockAddToast).toHaveBeenCalledWith(
          'Cannot get service logs costs.',
          'error',
        ),
      );
    });
  });
});
