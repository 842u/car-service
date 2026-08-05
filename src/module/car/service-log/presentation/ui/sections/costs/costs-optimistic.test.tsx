import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { buildServiceLogDto } from '@/car/service-log/application/dto/service-log.builder';
import { serviceLogApiClient } from '@/car/service-log/dependency/api-client';
import { serviceLogDataSource } from '@/car/service-log/dependency/data-source';
import { serviceLogAddMutationOptions } from '@/car/service-log/presentation/tanstack/mutation/add';
import { serviceLogEditMutationOptions } from '@/car/service-log/presentation/tanstack/mutation/edit';
import { serviceLogRemoveMutationOptions } from '@/car/service-log/presentation/tanstack/mutation/remove';
import { useCarCostsSection } from '@/car/service-log/presentation/ui/sections/car-costs/use-car-costs';
import { Result } from '@/common/application/result';

import { useCostsSection } from './use-costs';

const mockServiceLogDataSource = serviceLogDataSource as jest.Mocked<
  typeof serviceLogDataSource
>;
jest.mock('@/car/service-log/dependency/data-source');

const mockServiceLogApiClient = serviceLogApiClient as jest.Mocked<
  typeof serviceLogApiClient
>;
jest.mock('@/car/service-log/dependency/api-client');

jest.mock('@/common/presentation/hook/use-toasts', () => ({
  useToasts: () => ({ addToast: jest.fn() }),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return Wrapper;
}

async function renderCostsSections() {
  const wrapper = createWrapper();

  const { result: carCostsResult } = renderHook(
    () => useCarCostsSection({ carId: 'car-1' }),
    { wrapper },
  );
  const { result: globalCostsResult } = renderHook(() => useCostsSection(), {
    wrapper,
  });

  await waitFor(() => expect(carCostsResult.current.isPending).toBe(false));
  await waitFor(() => expect(globalCostsResult.current.isPending).toBe(false));

  return { wrapper, carCostsResult, globalCostsResult };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('costs sections settled state', () => {
  describe('add', () => {
    it('shows the new log in the car list but not the global list during the optimistic write', async () => {
      const existingServiceLog = buildServiceLogDto({
        id: 'log-1',
        carId: 'car-1',
      });

      mockServiceLogDataSource.getByCarId.mockResolvedValue(
        Result.ok([existingServiceLog]),
      );
      mockServiceLogDataSource.getAll.mockResolvedValue(
        Result.ok([existingServiceLog]),
      );
      mockServiceLogApiClient.add.mockReturnValue(new Promise(() => {}));

      const { wrapper, carCostsResult, globalCostsResult } =
        await renderCostsSections();

      const { result: mutationResult } = renderHook(
        () => useMutation(serviceLogAddMutationOptions),
        { wrapper },
      );

      mutationResult.current.mutate({
        carId: 'car-1',
        authorId: 'author-1',
        serviceDate: '2024-01-01T00:00:00Z',
        categories: ['engine'],
        mileage: 1000,
        notes: null,
        serviceCost: 50,
      });

      await waitFor(() => {
        expect(carCostsResult.current.serviceLogs).toHaveLength(2);
      });

      expect(globalCostsResult.current.serviceLogs).toEqual([
        existingServiceLog,
      ]);
    });

    it('shows the new log in both the car list and the global list once the mutation settles', async () => {
      const existingServiceLog = buildServiceLogDto({
        id: 'log-1',
        carId: 'car-1',
      });
      const newServiceLog = buildServiceLogDto({
        id: 'log-2',
        carId: 'car-1',
      });
      const settledServiceLogs = [existingServiceLog, newServiceLog];

      mockServiceLogDataSource.getByCarId
        .mockResolvedValueOnce(Result.ok([existingServiceLog]))
        .mockResolvedValueOnce(Result.ok(settledServiceLogs));
      mockServiceLogDataSource.getAll
        .mockResolvedValueOnce(Result.ok([existingServiceLog]))
        .mockResolvedValueOnce(Result.ok(settledServiceLogs));
      mockServiceLogApiClient.add.mockResolvedValue(Result.ok(newServiceLog));

      const { wrapper, carCostsResult, globalCostsResult } =
        await renderCostsSections();

      const { result: mutationResult } = renderHook(
        () => useMutation(serviceLogAddMutationOptions),
        { wrapper },
      );

      await mutationResult.current.mutateAsync({
        carId: 'car-1',
        authorId: 'author-1',
        serviceDate: '2024-01-01T00:00:00Z',
        categories: ['engine'],
        mileage: 1000,
        notes: null,
        serviceCost: 50,
      });

      await waitFor(() => {
        expect(carCostsResult.current.serviceLogs).toEqual(settledServiceLogs);
      });
      await waitFor(() => {
        expect(globalCostsResult.current.serviceLogs).toEqual(
          settledServiceLogs,
        );
      });
    });
  });

  describe('edit', () => {
    it('shows the edited fields in the car list but not the global list during the optimistic write', async () => {
      const existingServiceLog = buildServiceLogDto({
        id: 'log-1',
        carId: 'car-1',
        serviceCost: 100,
      });

      mockServiceLogDataSource.getByCarId.mockResolvedValue(
        Result.ok([existingServiceLog]),
      );
      mockServiceLogDataSource.getAll.mockResolvedValue(
        Result.ok([existingServiceLog]),
      );
      mockServiceLogApiClient.edit.mockReturnValue(new Promise(() => {}));

      const { wrapper, carCostsResult, globalCostsResult } =
        await renderCostsSections();

      const { result: mutationResult } = renderHook(
        () => useMutation(serviceLogEditMutationOptions),
        { wrapper },
      );

      mutationResult.current.mutate({
        carId: 'car-1',
        serviceLogId: 'log-1',
        serviceDate: '2024-02-01T00:00:00Z',
        categories: ['tires'],
        mileage: 2000,
        notes: 'rotated',
        serviceCost: 300,
      });

      await waitFor(() => {
        expect(carCostsResult.current.serviceLogs?.[0]).toMatchObject({
          serviceCost: 300,
        });
      });

      expect(globalCostsResult.current.serviceLogs).toEqual([
        existingServiceLog,
      ]);
    });

    it('shows the edited fields in both the car list and the global list once the mutation settles', async () => {
      const existingServiceLog = buildServiceLogDto({
        id: 'log-1',
        carId: 'car-1',
        serviceCost: 100,
      });
      const editedServiceLog = buildServiceLogDto({
        id: 'log-1',
        carId: 'car-1',
        serviceDate: '2024-02-01T00:00:00Z',
        categories: ['tires'],
        mileage: 2000,
        notes: 'rotated',
        serviceCost: 300,
      });

      mockServiceLogDataSource.getByCarId
        .mockResolvedValueOnce(Result.ok([existingServiceLog]))
        .mockResolvedValueOnce(Result.ok([editedServiceLog]));
      mockServiceLogDataSource.getAll
        .mockResolvedValueOnce(Result.ok([existingServiceLog]))
        .mockResolvedValueOnce(Result.ok([editedServiceLog]));
      mockServiceLogApiClient.edit.mockResolvedValue(
        Result.ok(editedServiceLog),
      );

      const { wrapper, carCostsResult, globalCostsResult } =
        await renderCostsSections();

      const { result: mutationResult } = renderHook(
        () => useMutation(serviceLogEditMutationOptions),
        { wrapper },
      );

      await mutationResult.current.mutateAsync({
        carId: 'car-1',
        serviceLogId: 'log-1',
        serviceDate: '2024-02-01T00:00:00Z',
        categories: ['tires'],
        mileage: 2000,
        notes: 'rotated',
        serviceCost: 300,
      });

      await waitFor(() => {
        expect(carCostsResult.current.serviceLogs).toEqual([editedServiceLog]);
      });
      await waitFor(() => {
        expect(globalCostsResult.current.serviceLogs).toEqual([
          editedServiceLog,
        ]);
      });
    });
  });

  describe('remove', () => {
    it('hides the removed log from the car list but not the global list during the optimistic write', async () => {
      const existingServiceLog = buildServiceLogDto({
        id: 'log-1',
        carId: 'car-1',
      });

      mockServiceLogDataSource.getByCarId.mockResolvedValue(
        Result.ok([existingServiceLog]),
      );
      mockServiceLogDataSource.getAll.mockResolvedValue(
        Result.ok([existingServiceLog]),
      );
      mockServiceLogApiClient.remove.mockReturnValue(new Promise(() => {}));

      const { wrapper, carCostsResult, globalCostsResult } =
        await renderCostsSections();

      const { result: mutationResult } = renderHook(
        () => useMutation(serviceLogRemoveMutationOptions),
        { wrapper },
      );

      mutationResult.current.mutate({ carId: 'car-1', serviceLogId: 'log-1' });

      await waitFor(() => {
        expect(carCostsResult.current.serviceLogs).toEqual([]);
      });

      expect(globalCostsResult.current.serviceLogs).toEqual([
        existingServiceLog,
      ]);
    });

    it('hides the removed log from both the car list and the global list once the mutation settles', async () => {
      const existingServiceLog = buildServiceLogDto({
        id: 'log-1',
        carId: 'car-1',
      });

      mockServiceLogDataSource.getByCarId
        .mockResolvedValueOnce(Result.ok([existingServiceLog]))
        .mockResolvedValueOnce(Result.ok([]));
      mockServiceLogDataSource.getAll
        .mockResolvedValueOnce(Result.ok([existingServiceLog]))
        .mockResolvedValueOnce(Result.ok([]));
      mockServiceLogApiClient.remove.mockResolvedValue(Result.ok(null));

      const { wrapper, carCostsResult, globalCostsResult } =
        await renderCostsSections();

      const { result: mutationResult } = renderHook(
        () => useMutation(serviceLogRemoveMutationOptions),
        { wrapper },
      );

      await mutationResult.current.mutateAsync({
        carId: 'car-1',
        serviceLogId: 'log-1',
      });

      await waitFor(() => {
        expect(carCostsResult.current.serviceLogs).toEqual([]);
      });
      await waitFor(() => {
        expect(globalCostsResult.current.serviceLogs).toEqual([]);
      });
    });
  });
});
