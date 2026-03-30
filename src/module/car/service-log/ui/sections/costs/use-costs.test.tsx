import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { createMockServiceLog } from '@/lib/jest/mock/src/module/car/service-log';
import { getServiceLogsWithCost } from '@/lib/supabase/tables/service_logs';

import { useCostsSection } from './use-costs';

jest.mock('@/lib/supabase/tables/service_logs');

const mockAddToast = jest.fn();
jest.mock('@/common/presentation/hook/use-toasts', () => ({
  useToasts: () => ({ addToast: mockAddToast }),
}));

const mockGetServiceLogsWithCost =
  getServiceLogsWithCost as jest.MockedFunction<typeof getServiceLogsWithCost>;

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

describe('useCostsSection', () => {
  describe('loading state', () => {
    it('should return isPending true initially', () => {
      mockGetServiceLogsWithCost.mockReturnValue(new Promise(() => {}));

      const { result } = renderHook(() => useCostsSection(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(true);
    });

    it('should return isPending false after data loads', async () => {
      mockGetServiceLogsWithCost.mockResolvedValue([]);

      const { result } = renderHook(() => useCostsSection(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isPending).toBe(false));
    });
  });

  describe('data fetching', () => {
    it('should return undefined serviceLogs while pending', () => {
      mockGetServiceLogsWithCost.mockReturnValue(new Promise(() => {}));

      const { result } = renderHook(() => useCostsSection(), {
        wrapper: createWrapper(),
      });

      expect(result.current.serviceLogs).toBeUndefined();
    });

    it('should return empty array when no service logs exist', async () => {
      mockGetServiceLogsWithCost.mockResolvedValue([]);

      const { result } = renderHook(() => useCostsSection(), {
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

      mockGetServiceLogsWithCost.mockResolvedValue(mockLogs);

      const { result } = renderHook(() => useCostsSection(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isPending).toBe(false));

      expect(result.current.serviceLogs).toEqual(mockLogs);
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
