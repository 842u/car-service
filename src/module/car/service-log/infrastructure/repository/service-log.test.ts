/* eslint testing-library/no-await-sync-queries:0 */
import type { ServiceLogMapper } from '@/car/service-log/application/mapper/service-log';
import { ServiceLogRepositoryImplementation } from '@/car/service-log/infrastructure/repository/service-log';
import { Result } from '@/common/application/result';
import type { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';
import { createMockSupabaseDatabaseClient } from '@/lib/jest/mock/src/common/infrastructure/supabase';
import { createMockServiceLogMapper } from '@/lib/jest/mock/src/module/car/service-log/application/mapper/service-log';
import { createMockServiceLogPersistence } from '@/lib/jest/mock/src/module/car/service-log/application/persistence-model/service-log';
import { createMockServiceLog } from '@/lib/jest/mock/src/module/car/service-log/domain/service-log';

describe('ServiceLogRepositoryImplementation', () => {
  let mockDbClient: jest.Mocked<SupabaseDatabaseClient>;
  let mockServiceLogMapper: jest.Mocked<ServiceLogMapper>;
  let repository: ServiceLogRepositoryImplementation;

  const serviceLog = createMockServiceLog();

  beforeEach(() => {
    mockDbClient = createMockSupabaseDatabaseClient();
    mockServiceLogMapper = createMockServiceLogMapper();
    repository = new ServiceLogRepositoryImplementation(
      mockDbClient,
      mockServiceLogMapper,
    );
  });

  describe('store', () => {
    it('returns success on a successful insert', async () => {
      const persistence = createMockServiceLogPersistence();

      mockServiceLogMapper.domainToPersistence.mockReturnValue(persistence);
      mockDbClient.query.mockResolvedValue(Result.ok(null));

      const result = await repository.store(serviceLog);

      expect(result.success).toBe(true);
      expect(mockServiceLogMapper.domainToPersistence).toHaveBeenCalledWith(
        serviceLog,
      );
      expect(mockDbClient.query).toHaveBeenCalled();
    });

    it('returns an error when the query fails', async () => {
      mockServiceLogMapper.domainToPersistence.mockReturnValue(
        createMockServiceLogPersistence(),
      );
      mockDbClient.query.mockResolvedValue(
        Result.fail({ message: 'Insert failed' }),
      );

      const result = await repository.store(serviceLog);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Insert failed');
      }
    });
  });

  describe('getById', () => {
    it('returns the mapped ServiceLog on success', async () => {
      const persistence = createMockServiceLogPersistence();

      mockDbClient.query.mockResolvedValue(Result.ok(persistence));
      mockServiceLogMapper.persistenceToDomain.mockReturnValue(
        Result.ok(serviceLog),
      );

      const result = await repository.getById(persistence.id);

      expect(result).toEqual(Result.ok(serviceLog));
      expect(mockServiceLogMapper.persistenceToDomain).toHaveBeenCalledWith(
        persistence,
      );
    });

    it('returns an error when the query fails', async () => {
      mockDbClient.query.mockResolvedValue(
        Result.fail({ message: 'Not found' }),
      );

      const result = await repository.getById('missing-id');

      expect(result.success).toBe(false);
    });

    it('returns an error when the row fails to map to the domain', async () => {
      mockDbClient.query.mockResolvedValue(
        Result.ok(createMockServiceLogPersistence()),
      );
      mockServiceLogMapper.persistenceToDomain.mockReturnValue(
        Result.fail({ message: 'Mapping failed', issues: [], name: '' }),
      );

      const result = await repository.getById('some-id');

      expect(result.success).toBe(false);
    });
  });
});
