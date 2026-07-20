/* eslint testing-library/no-await-sync-queries:0 */
import type { CarMapper } from '@/car/application/mapper/car';
import { createMockCarMapper } from '@/car/application/mapper/car.mock';
import { buildCarPersistence } from '@/car/application/persistence-model/car.builder';
import { buildCar } from '@/car/domain/car/car.builder';
import type { OwnershipMapper } from '@/car/ownership/application/mapper/ownership';
import { createMockOwnershipMapper } from '@/car/ownership/application/mapper/ownership.mock';
import { buildOwnershipPersistence } from '@/car/ownership/application/persistence-model/ownership.builder';
import { buildOwnership } from '@/car/ownership/domain/ownership/ownership.builder';
import { Result } from '@/common/application/result';
import type { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';
import { createMockSupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase.mock';

import { CarProvisioningImplementation } from './car';

describe('CarProvisioningImplementation', () => {
  let mockDbClient: jest.Mocked<SupabaseDatabaseClient>;
  let mockCarMapper: jest.Mocked<CarMapper>;
  let mockOwnershipMapper: jest.Mocked<OwnershipMapper>;
  let provisioning: CarProvisioningImplementation;

  const car = buildCar();
  const primaryOwnership = buildOwnership();

  beforeEach(() => {
    mockDbClient = createMockSupabaseDatabaseClient();
    mockCarMapper = createMockCarMapper();
    mockOwnershipMapper = createMockOwnershipMapper();
    provisioning = new CarProvisioningImplementation(
      mockDbClient,
      mockCarMapper,
      mockOwnershipMapper,
    );
  });

  describe('createWithPrimaryOwner', () => {
    it('should return success result on success', async () => {
      const carPersistence = buildCarPersistence();
      const primaryOwnerPersistence = buildOwnershipPersistence();

      mockCarMapper.domainToPersistence.mockReturnValue(carPersistence);
      mockOwnershipMapper.primaryOwnerToPersistence.mockReturnValue(
        primaryOwnerPersistence,
      );
      mockDbClient.rpc.mockResolvedValue(Result.ok(null));

      const result = await provisioning.createWithPrimaryOwner(
        car,
        primaryOwnership,
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
      expect(mockCarMapper.domainToPersistence).toHaveBeenCalledWith(car);
      expect(
        mockOwnershipMapper.primaryOwnerToPersistence,
      ).toHaveBeenCalledWith(
        primaryOwnership.id,
        primaryOwnership.primaryOwner,
      );
      expect(mockDbClient.rpc).toHaveBeenCalled();
    });

    it('should return error when the rpc fails', async () => {
      mockCarMapper.domainToPersistence.mockReturnValue(buildCarPersistence());
      mockOwnershipMapper.primaryOwnerToPersistence.mockReturnValue(
        buildOwnershipPersistence(),
      );
      mockDbClient.rpc.mockResolvedValue(
        Result.fail({ message: 'Provisioning failed' }),
      );

      const result = await provisioning.createWithPrimaryOwner(
        car,
        primaryOwnership,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Provisioning failed');
      }
    });
  });
});
