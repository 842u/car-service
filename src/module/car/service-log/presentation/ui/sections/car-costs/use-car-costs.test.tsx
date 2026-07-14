import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { serviceLogDataSource } from '@/car/service-log/dependency/data-source';
import { queryKeys } from '@/car/service-log/infrastructure/tanstack/query/keys';
import { useCarCostsSection } from '@/car/service-log/presentation/ui/sections/car-costs/use-car-costs';
import { Result } from '@/common/application/result';
import { queryKeySerialize } from '@/common/infrastructure/tanstack/query-key';
import { createMockServiceLogDto } from '@/lib/jest/mock/src/module/car/service-log/application/dto/service-log';

const mockServiceLogDataSource = serviceLogDataSource as jest.Mocked<
  typeof serviceLogDataSource
>;
jest.mock('@/car/service-log/dependency/data-source');

const mockAddToast = jest.fn();
jest.mock('@/common/presentation/hook/use-toasts', () => ({
  useToasts: () => ({ addToast: mockAddToast }),
}));

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
      mockServiceLogDataSource.getByCarId.mockReturnValue(
        new Promise(() => {}),
      );

      const { result } = renderHook(() => useCarCostsSection({ carId: '1' }), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(true);
    });

    it('should return isPending false after data loads', async () => {
      mockServiceLogDataSource.getByCarId.mockResolvedValue(Result.ok([]));

      const { result } = renderHook(() => useCarCostsSection({ carId: '1' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isPending).toBe(false));
    });
  });

  describe('data fetching', () => {
    it('should return undefined serviceLogs while pending', () => {
      mockServiceLogDataSource.getByCarId.mockReturnValue(
        new Promise(() => {}),
      );

      const { result } = renderHook(() => useCarCostsSection({ carId: '1' }), {
        wrapper: createWrapper(),
      });

      expect(result.current.serviceLogs).toBeUndefined();
    });

    it('should return empty array when no service logs exist', async () => {
      mockServiceLogDataSource.getByCarId.mockResolvedValue(Result.ok([]));

      const { result } = renderHook(() => useCarCostsSection({ carId: '1' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isPending).toBe(false));

      expect(result.current.serviceLogs).toEqual([]);
    });

    it('should return fetched service logs', async () => {
      const mockLogs = [
        createMockServiceLogDto({
          serviceCost: 100,
          serviceDate: '2026-01-01',
        }),
        createMockServiceLogDto({
          serviceCost: 200,
          serviceDate: '2026-02-01',
        }),
      ];

      mockServiceLogDataSource.getByCarId.mockResolvedValue(
        Result.ok(mockLogs),
      );

      const { result } = renderHook(() => useCarCostsSection({ carId: '1' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isPending).toBe(false));

      expect(result.current.serviceLogs).toEqual(mockLogs);
    });

    it('should call getByCarId with the given carId', async () => {
      mockServiceLogDataSource.getByCarId.mockResolvedValue(Result.ok([]));

      const { result } = renderHook(() => useCarCostsSection({ carId: '1' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isPending).toBe(false));

      expect(mockServiceLogDataSource.getByCarId).toHaveBeenCalledWith('1');
    });
  });

  describe('error handling', () => {
    it('should show error toast deduped against the service logs table query', async () => {
      mockServiceLogDataSource.getByCarId.mockResolvedValue(
        Result.fail({ message: 'DB error' }),
      );

      renderHook(() => useCarCostsSection({ carId: '1' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() =>
        expect(mockAddToast).toHaveBeenCalledWith(
          'DB error',
          'error',
          queryKeySerialize(queryKeys.serviceLogsByCarId('1')),
        ),
      );
    });

    it('should fall back to generic message when error has no message', async () => {
      mockServiceLogDataSource.getByCarId.mockResolvedValue(
        Result.fail({ message: '' }),
      );

      renderHook(() => useCarCostsSection({ carId: '1' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() =>
        expect(mockAddToast).toHaveBeenCalledWith(
          'Cannot get service logs costs.',
          'error',
          queryKeySerialize(queryKeys.serviceLogsByCarId('1')),
        ),
      );
    });
  });
});
