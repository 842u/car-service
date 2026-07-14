/* eslint testing-library/no-await-sync-queries:0 */
import type { ServiceLogMapper } from '@/car/service-log/application/mapper/service-log';
import { createMockServiceLogMapper } from '@/car/service-log/application/mapper/service-log.mock';
import { buildServiceLogPersistence } from '@/car/service-log/application/persistence-model/service-log.builder';
import { buildServiceLog } from '@/car/service-log/domain/service-log/service-log.builder';
import { ServiceLogRepositoryImplementation } from '@/car/service-log/infrastructure/repository/service-log';
import { Result } from '@/common/application/result';
import type { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';
import { createMockSupabaseDatabaseClient } from '@/lib/jest/mock/src/common/infrastructure/supabase';

describe('ServiceLogRepositoryImplementation', () => {
  let mockDbClient: jest.Mocked<SupabaseDatabaseClient>;
  let mockServiceLogMapper: jest.Mocked<ServiceLogMapper>;
  let repository: ServiceLogRepositoryImplementation;

  const serviceLog = buildServiceLog();

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
      const persistence = buildServiceLogPersistence();

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
        buildServiceLogPersistence(),
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

  describe('update', () => {
    it('returns success on a successful update', async () => {
      const persistence = buildServiceLogPersistence();

      mockServiceLogMapper.domainToPersistence.mockReturnValue(persistence);
      mockDbClient.query.mockResolvedValue(Result.ok(null));

      const result = await repository.update(serviceLog);

      expect(result.success).toBe(true);
      expect(mockServiceLogMapper.domainToPersistence).toHaveBeenCalledWith(
        serviceLog,
      );
      expect(mockDbClient.query).toHaveBeenCalled();
    });

    it('returns an error when the query fails', async () => {
      mockServiceLogMapper.domainToPersistence.mockReturnValue(
        buildServiceLogPersistence(),
      );
      mockDbClient.query.mockResolvedValue(
        Result.fail({ message: 'Update failed' }),
      );

      const result = await repository.update(serviceLog);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Update failed');
      }
    });
  });

  describe('remove', () => {
    it('returns success on a successful delete', async () => {
      mockDbClient.query.mockResolvedValue(Result.ok(null));

      const result = await repository.remove(serviceLog);

      expect(result.success).toBe(true);
      expect(mockDbClient.query).toHaveBeenCalled();
    });

    it('returns an error when the query fails', async () => {
      mockDbClient.query.mockResolvedValue(
        Result.fail({ message: 'Delete failed' }),
      );

      const result = await repository.remove(serviceLog);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Delete failed');
      }
    });
  });

  describe('getById', () => {
    it('returns the mapped ServiceLog on success', async () => {
      const persistence = buildServiceLogPersistence();

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
        Result.ok(buildServiceLogPersistence()),
      );
      mockServiceLogMapper.persistenceToDomain.mockReturnValue(
        Result.fail({ message: 'Mapping failed', issues: [], name: '' }),
      );

      const result = await repository.getById('some-id');

      expect(result.success).toBe(false);
    });
  });
});
