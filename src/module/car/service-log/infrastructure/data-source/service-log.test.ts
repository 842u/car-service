/* eslint testing-library/no-await-sync-queries:0 */
import { buildServiceLogDto } from '@/car/service-log/application/dto/service-log.builder';
import type { ServiceLogMapper } from '@/car/service-log/application/mapper/service-log';
import { createMockServiceLogMapper } from '@/car/service-log/application/mapper/service-log.mock';
import { buildServiceLogPersistence } from '@/car/service-log/application/persistence-model/service-log.builder';
import { Result } from '@/common/application/result';
import type { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';
import { createMockSupabaseDatabaseClient } from '@/lib/jest/mock/src/common/infrastructure/supabase';

import { ServiceLogDataSourceImplementation } from './service-log';

describe('ServiceLogDataSourceImplementation', () => {
  let mockDbClient: jest.Mocked<SupabaseDatabaseClient>;
  let mockServiceLogMapper: jest.Mocked<ServiceLogMapper>;
  let dataSource: ServiceLogDataSourceImplementation;

  beforeEach(() => {
    mockDbClient = createMockSupabaseDatabaseClient();
    mockServiceLogMapper = createMockServiceLogMapper();
    dataSource = new ServiceLogDataSourceImplementation(
      mockDbClient,
      mockServiceLogMapper,
    );
  });

  describe('getByCarId', () => {
    const carId = '5202140b-aa28-4058-9191-e4a117e15353';

    it('returns service log DTOs on success', async () => {
      const persistenceList = [
        buildServiceLogPersistence({ car_id: carId }),
        buildServiceLogPersistence({ car_id: carId }),
      ];
      const dtoA = buildServiceLogDto();
      const dtoB = buildServiceLogDto();

      mockDbClient.query.mockResolvedValue(Result.ok(persistenceList));
      mockServiceLogMapper.persistenceToDto
        .mockReturnValueOnce(dtoA)
        .mockReturnValueOnce(dtoB);

      const result = await dataSource.getByCarId(carId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([dtoA, dtoB]);
      }
      expect(mockDbClient.query).toHaveBeenCalled();
      expect(mockServiceLogMapper.persistenceToDto).toHaveBeenCalledTimes(2);
    });

    it('returns an error when the query fails', async () => {
      mockDbClient.query.mockResolvedValue(
        Result.fail({ message: 'Service logs not found' }),
      );

      const result = await dataSource.getByCarId(carId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Service logs not found');
      }
    });
  });

  describe('getAll', () => {
    it('returns service log DTOs on success', async () => {
      const persistenceList = [
        buildServiceLogPersistence(),
        buildServiceLogPersistence(),
      ];
      const dtoA = buildServiceLogDto();
      const dtoB = buildServiceLogDto();

      mockDbClient.query.mockResolvedValue(Result.ok(persistenceList));
      mockServiceLogMapper.persistenceToDto
        .mockReturnValueOnce(dtoA)
        .mockReturnValueOnce(dtoB);

      const result = await dataSource.getAll();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([dtoA, dtoB]);
      }
      expect(mockDbClient.query).toHaveBeenCalled();
      expect(mockServiceLogMapper.persistenceToDto).toHaveBeenCalledTimes(2);
    });

    it('returns an error when the query fails', async () => {
      mockDbClient.query.mockResolvedValue(
        Result.fail({ message: 'Service logs not found' }),
      );

      const result = await dataSource.getAll();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Service logs not found');
      }
    });
  });
});
