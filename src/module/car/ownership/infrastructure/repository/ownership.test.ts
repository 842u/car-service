/* eslint testing-library/no-await-sync-queries:0 */
import type { OwnershipMapper } from '@/car/ownership/application/mapper/ownership';
import { createMockOwnershipMapper } from '@/car/ownership/application/mapper/ownership.mock';
import { buildOwnershipPersistence } from '@/car/ownership/application/persistence-model/ownership.builder';
import { buildCarOwnership } from '@/car/ownership/domain/ownership/car-ownership.builder';
import { Result } from '@/common/application/result';
import type { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';
import { createMockSupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase.mock';

import { OwnershipRepositoryImplementation } from './ownership';

describe('OwnershipRepositoryImplementation', () => {
  let mockDbClient: jest.Mocked<SupabaseDatabaseClient>;
  let mockOwnershipMapper: jest.Mocked<OwnershipMapper>;
  let repository: OwnershipRepositoryImplementation;

  const carOwnership = buildCarOwnership();

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
      const rows = [buildOwnershipPersistence({ car_id: carId })];

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
      const row = buildOwnershipPersistence();

      mockOwnershipMapper.newCoOwnerToPersistence.mockReturnValue(row);
      mockDbClient.mutate.mockResolvedValue(Result.ok([row]));

      const result = await repository.addOwner(carOwnership, newOwnerId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
      expect(mockOwnershipMapper.newCoOwnerToPersistence).toHaveBeenCalledWith(
        carOwnership.id,
        newOwnerId,
      );
      expect(mockDbClient.mutate).toHaveBeenCalledWith(expect.any(Function), 1);
    });

    it('should return error when the mutation fails', async () => {
      const newOwnerId = carOwnership.coOwners[0] ?? carOwnership.primaryOwner;

      mockOwnershipMapper.newCoOwnerToPersistence.mockReturnValue(
        buildOwnershipPersistence(),
      );
      mockDbClient.mutate.mockResolvedValue(
        Result.fail({ message: 'Insert failed' }),
      );

      const result = await repository.addOwner(carOwnership, newOwnerId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Insert failed');
      }
    });
  });

  describe('removeOwner', () => {
    it('should delete the target owner row on success', async () => {
      const targetId = carOwnership.coOwners[0] ?? carOwnership.primaryOwner;

      mockDbClient.mutate.mockResolvedValue(
        Result.ok([buildOwnershipPersistence()]),
      );

      const result = await repository.removeOwner(carOwnership, targetId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
      expect(mockDbClient.mutate).toHaveBeenCalledWith(expect.any(Function), 1);
    });

    it('should return error when the mutation fails', async () => {
      const targetId = carOwnership.coOwners[0] ?? carOwnership.primaryOwner;

      mockDbClient.mutate.mockResolvedValue(
        Result.fail({ message: 'Delete failed' }),
      );

      const result = await repository.removeOwner(carOwnership, targetId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Delete failed');
      }
    });
  });

  describe('promotePrimary', () => {
    it('should call the swap function on success', async () => {
      const newPrimaryOwnerId =
        carOwnership.coOwners[0] ?? carOwnership.primaryOwner;

      mockDbClient.rpc.mockResolvedValue(Result.ok(newPrimaryOwnerId.value));

      const result = await repository.promotePrimary(
        carOwnership,
        newPrimaryOwnerId,
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
      expect(mockDbClient.rpc).toHaveBeenCalled();
    });

    it('should return error when the swap function fails', async () => {
      const newPrimaryOwnerId =
        carOwnership.coOwners[0] ?? carOwnership.primaryOwner;

      mockDbClient.rpc.mockResolvedValue(
        Result.fail({ message: 'Promote failed' }),
      );

      const result = await repository.promotePrimary(
        carOwnership,
        newPrimaryOwnerId,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Promote failed');
      }
    });
  });
});
