import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { useCarCostsSection } from '@/car/service-log/ui/sections/car-costs/use-car-costs';
import { createMockServiceLog } from '@/lib/jest/mock/src/module/car/service-log';
import { getServiceLogsWithCostByCarId } from '@/lib/supabase/tables/service_logs';

jest.mock('@/lib/supabase/tables/service_logs');

const mockAddToast = jest.fn();
jest.mock('@/common/presentation/hook/use-toasts', () => ({
  useToasts: () => ({ addToast: mockAddToast }),
}));

const mockGetServiceLogsWithCostByCarId =
  getServiceLogsWithCostByCarId as jest.MockedFunction<
    typeof getServiceLogsWithCostByCarId
  >;

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
});

describe('useCarCostsSection', () => {
  describe('loading state', () => {
    it('should return isPending true initially', () => {
      mockGetServiceLogsWithCostByCarId.mockReturnValue(new Promise(() => {}));

      const { result } = renderHook(() => useCarCostsSection({ carId: '1' }), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(true);
    });

    it('should return isPending false after data loads', async () => {
      mockGetServiceLogsWithCostByCarId.mockResolvedValue([]);

      const { result } = renderHook(() => useCarCostsSection({ carId: '1' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isPending).toBe(false));
    });
  });

  describe('data fetching', () => {
    it('should return undefined serviceLogs while pending', () => {
      mockGetServiceLogsWithCostByCarId.mockReturnValue(new Promise(() => {}));

      const { result } = renderHook(() => useCarCostsSection({ carId: '1' }), {
        wrapper: createWrapper(),
      });

      expect(result.current.serviceLogs).toBeUndefined();
    });

    it('should return empty array when no service logs exist', async () => {
      mockGetServiceLogsWithCostByCarId.mockResolvedValue([]);

      const { result } = renderHook(() => useCarCostsSection({ carId: '1' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isPending).toBe(false));

      expect(result.current.serviceLogs).toEqual([]);
    });

    it('should return fetched service logs', async () => {
      const mockLogs = [
        createMockServiceLog({ service_cost: 100, service_date: '2026-01-01' }),
        createMockServiceLog({ service_cost: 200, service_date: '2026-02-01' }),
      ];

      mockGetServiceLogsWithCostByCarId.mockResolvedValue(mockLogs);

      const { result } = renderHook(() => useCarCostsSection({ carId: '1' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isPending).toBe(false));

      expect(result.current.serviceLogs).toEqual(mockLogs);
    });
  });

  describe('error handling', () => {
    it('should show error toast when fetch fails', async () => {
      mockGetServiceLogsWithCostByCarId.mockRejectedValue(
        new Error('DB error'),
      );

      renderHook(() => useCarCostsSection({ carId: '1' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() =>
        expect(mockAddToast).toHaveBeenCalledWith('DB error', 'error'),
      );
    });

    it('should fall back to generic message when error has no message', async () => {
      mockGetServiceLogsWithCostByCarId.mockRejectedValue(new Error(''));

      renderHook(() => useCarCostsSection({ carId: '1' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() =>
        expect(mockAddToast).toHaveBeenCalledWith(
          'Cannot get service logs costs.',
          'error',
        ),
      );
    });
  });
});
