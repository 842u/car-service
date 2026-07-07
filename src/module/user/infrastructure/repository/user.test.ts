/* eslint testing-library/no-await-sync-queries:0 */
import { Result } from '@/common/application/result';
import type { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';
import { createMockSupabaseDatabaseClient } from '@/lib/jest/mock/src/common/infrastructure/supabase';
import { createMockUserMapper } from '@/lib/jest/mock/src/module/user/application/mapper/user';
import { createMockUserPersistence } from '@/lib/jest/mock/src/module/user/application/persistence-model/user';
import { createMockUser } from '@/lib/jest/mock/src/module/user/domain/user/user';
import type { UserMapper } from '@/user/application/mapper/user';

import { UserRepositoryImplementation } from './user';

describe('UserRepositoryImplementation', () => {
  let mockDbClient: jest.Mocked<SupabaseDatabaseClient>;
  let mockUserMapper: jest.Mocked<UserMapper>;
  let repository: UserRepositoryImplementation;

  const user = createMockUser();

  beforeEach(() => {
    mockDbClient = createMockSupabaseDatabaseClient();
    mockUserMapper = createMockUserMapper();
    repository = new UserRepositoryImplementation(mockDbClient, mockUserMapper);
  });

  describe('store', () => {
    it('should return success result on success', async () => {
      const persistence = createMockUserPersistence();

      mockUserMapper.domainToPersistence.mockReturnValue(persistence);
      mockDbClient.query.mockResolvedValue(Result.ok(null));

      const result = await repository.store(user);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
      expect(mockUserMapper.domainToPersistence).toHaveBeenCalledWith(user);
      expect(mockDbClient.query).toHaveBeenCalled();
    });

    it('should return error when query fails', async () => {
      mockUserMapper.domainToPersistence.mockReturnValue(
        createMockUserPersistence(),
      );
      mockDbClient.query.mockResolvedValue(
        Result.fail({ message: 'Insert failed' }),
      );

      const result = await repository.store(user);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Insert failed');
      }
    });
  });

  describe('remove', () => {
    it('should return success result on success', async () => {
      mockDbClient.query.mockResolvedValue(Result.ok(null));

      const result = await repository.remove(user);

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

      const result = await repository.remove(user);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Delete failed');
      }
    });
  });

  describe('getById', () => {
    const userId = '44dd8410-a912-480f-95be-9ad4cbe30d7f';

    it('should return user domain on success', async () => {
      const persistence = createMockUserPersistence({ id: userId });

      mockDbClient.query.mockResolvedValue(Result.ok(persistence));
      mockUserMapper.persistenceToDomain.mockReturnValue(Result.ok(user));

      const result = await repository.getById(userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(user);
      }
      expect(mockDbClient.query).toHaveBeenCalled();
      expect(mockUserMapper.persistenceToDomain).toHaveBeenCalledWith(
        persistence,
      );
    });

    it('should return error when query fails', async () => {
      mockDbClient.query.mockResolvedValue(
        Result.fail({ message: 'User not found' }),
      );

      const result = await repository.getById(userId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('User not found');
      }
      expect(mockUserMapper.persistenceToDomain).not.toHaveBeenCalled();
    });

    it('should return error when mapping fails', async () => {
      const persistence = createMockUserPersistence({ id: userId });

      mockDbClient.query.mockResolvedValue(Result.ok(persistence));
      mockUserMapper.persistenceToDomain.mockReturnValue(
        Result.fail({ message: 'Mapping failed', issues: [], name: '' }),
      );

      const result = await repository.getById(userId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Mapping failed');
      }
    });
  });

  describe('update', () => {
    it('should return success result on success', async () => {
      const persistence = createMockUserPersistence();

      mockUserMapper.domainToPersistence.mockReturnValue(persistence);
      mockDbClient.query.mockResolvedValue(Result.ok(null));

      const result = await repository.update(user);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
      expect(mockUserMapper.domainToPersistence).toHaveBeenCalledWith(user);
      expect(mockDbClient.query).toHaveBeenCalled();
    });

    it('should return error when query fails', async () => {
      mockUserMapper.domainToPersistence.mockReturnValue(
        createMockUserPersistence(),
      );
      mockDbClient.query.mockResolvedValue(
        Result.fail({ message: 'Update failed' }),
      );

      const result = await repository.update(user);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Update failed');
      }
    });
  });
});
