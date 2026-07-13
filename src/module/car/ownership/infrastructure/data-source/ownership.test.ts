/* eslint testing-library/no-await-sync-queries:0 */
import type { OwnershipMapper } from '@/car/ownership/application/mapper/ownership';
import { Result } from '@/common/application/result';
import type { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';
import { createMockSupabaseDatabaseClient } from '@/lib/jest/mock/src/common/infrastructure/supabase';
import { createMockOwnershipDto } from '@/lib/jest/mock/src/module/car/ownership/application/dto/ownership';
import { createMockOwnershipMapper } from '@/lib/jest/mock/src/module/car/ownership/application/mapper/ownership';
import { createMockOwnershipPersistence } from '@/lib/jest/mock/src/module/car/ownership/application/persistence-model/ownership';

import { OwnershipDataSourceImplementation } from './ownership';

describe('OwnershipDataSourceImplementation', () => {
  let mockDbClient: jest.Mocked<SupabaseDatabaseClient>;
  let mockOwnershipMapper: jest.Mocked<OwnershipMapper>;
  let dataSource: OwnershipDataSourceImplementation;

  beforeEach(() => {
    mockDbClient = createMockSupabaseDatabaseClient();
    mockOwnershipMapper = createMockOwnershipMapper();
    dataSource = new OwnershipDataSourceImplementation(
      mockDbClient,
      mockOwnershipMapper,
    );
  });

  describe('getByCarId', () => {
    const carId = '5202140b-aa28-4058-9191-e4a117e15353';

    it('returns ownership DTOs on success', async () => {
      const persistenceList = [
        createMockOwnershipPersistence({ car_id: carId }),
        createMockOwnershipPersistence({ car_id: carId }),
      ];
      const dtoA = createMockOwnershipDto();
      const dtoB = createMockOwnershipDto();

      mockDbClient.query.mockResolvedValue(Result.ok(persistenceList));
      mockOwnershipMapper.persistenceToDto
        .mockReturnValueOnce(dtoA)
        .mockReturnValueOnce(dtoB);

      const result = await dataSource.getByCarId(carId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([dtoA, dtoB]);
      }
      expect(mockDbClient.query).toHaveBeenCalled();
      expect(mockOwnershipMapper.persistenceToDto).toHaveBeenCalledTimes(2);
    });

    it('returns an error when the query fails', async () => {
      mockDbClient.query.mockResolvedValue(
        Result.fail({ message: 'Ownerships not found' }),
      );

      const result = await dataSource.getByCarId(carId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Ownerships not found');
      }
    });
  });

  describe('getByOwnerId', () => {
    const ownerId = 'b5b55395-e32f-4376-be03-f66be0a63ec4';

    it('returns ownership DTOs on success', async () => {
      const persistenceList = [
        createMockOwnershipPersistence({ owner_id: ownerId }),
      ];
      const dto = createMockOwnershipDto();

      mockDbClient.query.mockResolvedValue(Result.ok(persistenceList));
      mockOwnershipMapper.persistenceToDto.mockReturnValue(dto);

      const result = await dataSource.getByOwnerId(ownerId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([dto]);
      }
    });

    it('returns an error when the query fails', async () => {
      mockDbClient.query.mockResolvedValue(
        Result.fail({ message: 'Query failed' }),
      );

      const result = await dataSource.getByOwnerId(ownerId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Query failed');
      }
    });
  });
});
