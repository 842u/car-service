/* eslint testing-library/no-await-sync-queries:0 */
import type { OwnershipMapper } from '@/car/ownership/application/mapper/ownership';
import { Result } from '@/common/application/result';
import type { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';
import { createMockSupabaseDatabaseClient } from '@/lib/jest/mock/src/common/infrastructure/supabase';
import { createMockOwnershipMapper } from '@/lib/jest/mock/src/module/car/ownership/application/mapper/ownership';
import { createMockOwnershipPersistence } from '@/lib/jest/mock/src/module/car/ownership/application/persistence-model/ownership';
import { createMockCarOwnership } from '@/lib/jest/mock/src/module/car/ownership/domain/ownership/car-ownership';

import { OwnershipRepositoryImplementation } from './ownership';

describe('OwnershipRepositoryImplementation', () => {
  let mockDbClient: jest.Mocked<SupabaseDatabaseClient>;
  let mockOwnershipMapper: jest.Mocked<OwnershipMapper>;
  let repository: OwnershipRepositoryImplementation;

  const carOwnership = createMockCarOwnership();

  beforeEach(() => {
    mockDbClient = createMockSupabaseDatabaseClient();
    mockOwnershipMapper = createMockOwnershipMapper();
    repository = new OwnershipRepositoryImplementation(
      mockDbClient,
      mockOwnershipMapper,
    );
  });

  describe('getByCarId', () => {
    const carId = '6a6e49f5-9711-4a95-9fc2-3e14d0b5a4e6';

    it('should return the reconstituted aggregate on success', async () => {
      const rows = [createMockOwnershipPersistence({ car_id: carId })];

      mockDbClient.query.mockResolvedValue(Result.ok(rows));
      mockOwnershipMapper.persistenceToDomain.mockReturnValue(
        Result.ok(carOwnership),
      );

      const result = await repository.getByCarId(carId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(carOwnership);
      }
      expect(mockDbClient.query).toHaveBeenCalled();
      expect(mockOwnershipMapper.persistenceToDomain).toHaveBeenCalledWith(
        rows,
      );
    });

    it('should return error when query fails', async () => {
      mockDbClient.query.mockResolvedValue(
        Result.fail({ message: 'Ownership not found' }),
      );

      const result = await repository.getByCarId(carId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Ownership not found');
      }
      expect(mockOwnershipMapper.persistenceToDomain).not.toHaveBeenCalled();
    });

    it('should return error when mapping fails', async () => {
      mockDbClient.query.mockResolvedValue(Result.ok([]));
      mockOwnershipMapper.persistenceToDomain.mockReturnValue(
        Result.fail({ message: 'Mapping failed', issues: [], name: '' }),
      );

      const result = await repository.getByCarId(carId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Mapping failed');
      }
    });
  });

  describe('addOwner', () => {
    it('should insert the new co-owner row on success', async () => {
      const newOwnerId = carOwnership.coOwners[0] ?? carOwnership.primaryOwner;
      const row = createMockOwnershipPersistence();

      mockOwnershipMapper.newCoOwnerToPersistence.mockReturnValue(row);
      mockDbClient.query.mockResolvedValue(Result.ok(null));

      const result = await repository.addOwner(carOwnership, newOwnerId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
      expect(mockOwnershipMapper.newCoOwnerToPersistence).toHaveBeenCalledWith(
        carOwnership.id,
        newOwnerId,
      );
      expect(mockDbClient.query).toHaveBeenCalled();
    });

    it('should return error when query fails', async () => {
      const newOwnerId = carOwnership.coOwners[0] ?? carOwnership.primaryOwner;

      mockOwnershipMapper.newCoOwnerToPersistence.mockReturnValue(
        createMockOwnershipPersistence(),
      );
      mockDbClient.query.mockResolvedValue(
        Result.fail({ message: 'Insert failed' }),
      );

      const result = await repository.addOwner(carOwnership, newOwnerId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Insert failed');
      }
    });
  });
});
