/* eslint testing-library/no-await-sync-queries:0 */
import type { CarMapper } from '@/car/application/mapper/car';
import { Result } from '@/common/application/result';
import type { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';
import { createMockSupabaseDatabaseClient } from '@/lib/jest/mock/src/common/infrastructure/supabase';
import { createMockCarMapper } from '@/lib/jest/mock/src/module/car/application/mapper/car';
import { createMockCarPersistence } from '@/lib/jest/mock/src/module/car/application/persistence-model/car';
import { createMockCar } from '@/lib/jest/mock/src/module/car/domain/car/car';

import { CarRepositoryImplementation } from './car';

describe('CarRepositoryImplementation', () => {
  let mockDbClient: jest.Mocked<SupabaseDatabaseClient>;
  let mockCarMapper: jest.Mocked<CarMapper>;
  let repository: CarRepositoryImplementation;

  const car = createMockCar();

  beforeEach(() => {
    mockDbClient = createMockSupabaseDatabaseClient();
    mockCarMapper = createMockCarMapper();
    repository = new CarRepositoryImplementation(mockDbClient, mockCarMapper);
  });

  describe('store', () => {
    it('should return success result on success', async () => {
      const persistence = createMockCarPersistence();

      mockCarMapper.domainToPersistence.mockReturnValue(persistence);
      mockDbClient.query.mockResolvedValue(Result.ok(null));

      const result = await repository.store(car);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
      expect(mockCarMapper.domainToPersistence).toHaveBeenCalledWith(car);
      expect(mockDbClient.query).toHaveBeenCalled();
    });

    it('should return error when query fails', async () => {
      mockCarMapper.domainToPersistence.mockReturnValue(
        createMockCarPersistence(),
      );
      mockDbClient.query.mockResolvedValue(
        Result.fail({ message: 'Insert failed' }),
      );

      const result = await repository.store(car);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Insert failed');
      }
    });
  });

  describe('remove', () => {
    it('should return success result on success', async () => {
      mockDbClient.query.mockResolvedValue(Result.ok(null));

      const result = await repository.remove(car);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
      expect(mockDbClient.query).toHaveBeenCalled();
    });

    it('should return error when query fails', async () => {
      mockDbClient.query.mockResolvedValue(
        Result.fail({ message: 'Delete failed' }),
      );

      const result = await repository.remove(car);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Delete failed');
      }
    });
  });

  describe('getById', () => {
    const carId = '6a6e49f5-9711-4a95-9fc2-3e14d0b5a4e6';

    it('should return car domain on success', async () => {
      const persistence = createMockCarPersistence({ id: carId });

      mockDbClient.query.mockResolvedValue(Result.ok(persistence));
      mockCarMapper.persistenceToDomain.mockReturnValue(Result.ok(car));

      const result = await repository.getById(carId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(car);
      }
      expect(mockDbClient.query).toHaveBeenCalled();
      expect(mockCarMapper.persistenceToDomain).toHaveBeenCalledWith(
        persistence,
      );
    });

    it('should return error when query fails', async () => {
      mockDbClient.query.mockResolvedValue(
        Result.fail({ message: 'Car not found' }),
      );

      const result = await repository.getById(carId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Car not found');
      }
      expect(mockCarMapper.persistenceToDomain).not.toHaveBeenCalled();
    });

    it('should return error when mapping fails', async () => {
      const persistence = createMockCarPersistence({ id: carId });

      mockDbClient.query.mockResolvedValue(Result.ok(persistence));
      mockCarMapper.persistenceToDomain.mockReturnValue(
        Result.fail({ message: 'Mapping failed', issues: [], name: '' }),
      );

      const result = await repository.getById(carId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Mapping failed');
      }
    });
  });

  describe('update', () => {
    it('should return success result on success', async () => {
      const persistence = createMockCarPersistence();

      mockCarMapper.domainToPersistence.mockReturnValue(persistence);
      mockDbClient.query.mockResolvedValue(Result.ok(null));

      const result = await repository.update(car);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
      expect(mockCarMapper.domainToPersistence).toHaveBeenCalledWith(car);
      expect(mockDbClient.query).toHaveBeenCalled();
    });

    it('should return error when query fails', async () => {
      mockCarMapper.domainToPersistence.mockReturnValue(
        createMockCarPersistence(),
      );
      mockDbClient.query.mockResolvedValue(
        Result.fail({ message: 'Update failed' }),
      );

      const result = await repository.update(car);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Update failed');
      }
    });
  });
});
