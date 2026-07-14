/* eslint testing-library/no-await-sync-queries:0 */
import { buildCarDto } from '@/car/application/dto/car.builder';
import type { CarMapper } from '@/car/application/mapper/car';
import { createMockCarMapper } from '@/car/application/mapper/car.mock';
import { buildCarPersistence } from '@/car/application/persistence-model/car.builder';
import { Result } from '@/common/application/result';
import type { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';
import { createMockSupabaseDatabaseClient } from '@/lib/jest/mock/src/common/infrastructure/supabase';

import { CarDataSourceImplementation } from './car';

describe('CarDataSourceImplementation', () => {
  let mockDbClient: jest.Mocked<SupabaseDatabaseClient>;
  let mockCarMapper: jest.Mocked<CarMapper>;
  let dataSource: CarDataSourceImplementation;

  beforeEach(() => {
    mockDbClient = createMockSupabaseDatabaseClient();
    mockCarMapper = createMockCarMapper();
    dataSource = new CarDataSourceImplementation(mockDbClient, mockCarMapper);
  });

  describe('getById', () => {
    const carId = '6a6e49f5-9711-4a95-9fc2-3e14d0b5a4e6';
    const carDto = buildCarDto({ id: carId });

    it('should return car DTO on success', async () => {
      const persistence = buildCarPersistence({ id: carId });

      mockDbClient.query.mockResolvedValue(Result.ok(persistence));
      mockCarMapper.persistenceToDto.mockReturnValue(carDto);

      const result = await dataSource.getById(carId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(carDto);
      }
      expect(mockDbClient.query).toHaveBeenCalled();
      expect(mockCarMapper.persistenceToDto).toHaveBeenCalledWith(persistence);
    });

    it('should return error when query fails', async () => {
      mockDbClient.query.mockResolvedValue(
        Result.fail({ message: 'Car not found' }),
      );

      const result = await dataSource.getById(carId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Car not found');
      }
    });
  });

  describe('getByPage', () => {
    it('should return array of car DTOs and next page param on success', async () => {
      const persistenceList = [buildCarPersistence(), buildCarPersistence()];
      const dtoA = buildCarDto();
      const dtoB = buildCarDto();

      mockDbClient.query.mockResolvedValue(Result.ok(persistenceList));
      mockCarMapper.persistenceToDto
        .mockReturnValueOnce(dtoA)
        .mockReturnValueOnce(dtoB);

      const result = await dataSource.getByPage({ pageParam: 0 });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          data: [dtoA, dtoB],
          nextPageParam: null,
        });
      }
      expect(mockCarMapper.persistenceToDto).toHaveBeenCalledTimes(2);
    });

    it('should return next page param when a full page is returned', async () => {
      const persistenceList = Array.from({ length: 15 }, () =>
        buildCarPersistence(),
      );

      mockDbClient.query.mockResolvedValue(Result.ok(persistenceList));
      mockCarMapper.persistenceToDto.mockReturnValue(buildCarDto());

      const result = await dataSource.getByPage({ pageParam: 0 });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.nextPageParam).toBe(1);
      }
    });

    it('should return error when query fails', async () => {
      mockDbClient.query.mockResolvedValue(
        Result.fail({ message: 'Query failed' }),
      );

      const result = await dataSource.getByPage({ pageParam: 0 });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Query failed');
      }
    });
  });
});
