/* eslint testing-library/no-await-sync-queries:0 */
import type { AuthClient } from '@/common/application/auth-client';
import { createMockAuthClient } from '@/common/application/auth-client.mock';
import { Result } from '@/common/application/result';
import type { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';
import { createMockSupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase.mock';
import { createMockAuthIdentity } from '@/test/mock/@supabase/auth';
import { buildUserDto } from '@/user/application/dto/user.builder';
import type { UserMapper } from '@/user/application/mapper/user';
import { createMockUserMapper } from '@/user/application/mapper/user.mock';
import { buildUserPersistence } from '@/user/application/persistence-model/user.builder';

import { UserDataSourceImplementation } from './user';

describe('UserDataSourceImplementation', () => {
  let mockAuthClient: jest.Mocked<AuthClient>;
  let mockDbClient: jest.Mocked<SupabaseDatabaseClient>;
  let mockUserMapper: jest.Mocked<UserMapper>;
  let dataSource: UserDataSourceImplementation;

  beforeEach(() => {
    mockAuthClient = createMockAuthClient();
    mockDbClient = createMockSupabaseDatabaseClient();
    mockUserMapper = createMockUserMapper();
    dataSource = new UserDataSourceImplementation(
      mockAuthClient,
      mockDbClient,
      mockUserMapper,
    );
  });

  describe('getById', () => {
    const userId = '44dd8410-a912-480f-95be-9ad4cbe30d7f';
    const userDto = buildUserDto({ id: userId });

    it('should return user DTO on success', async () => {
      const persistence = buildUserPersistence({ id: userId });

      mockDbClient.query.mockResolvedValue(Result.ok(persistence));
      mockUserMapper.persistenceToDto.mockReturnValue(userDto);

      const result = await dataSource.getById(userId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(userDto);
      }
      expect(mockDbClient.query).toHaveBeenCalled();
      expect(mockUserMapper.persistenceToDto).toHaveBeenCalledWith(persistence);
    });

    it('should return error when query fails', async () => {
      mockDbClient.query.mockResolvedValue(
        Result.fail({ message: 'User not found' }),
      );

      const result = await dataSource.getById(userId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('User not found');
      }
    });
  });

  describe('getSessionUser', () => {
    const authIdentity = createMockAuthIdentity();
    const userDto = buildUserDto({ id: authIdentity.id });

    it('should return user DTO on success', async () => {
      const persistence = buildUserPersistence({ id: authIdentity.id });

      mockAuthClient.authenticate.mockResolvedValue(Result.ok(authIdentity));
      mockDbClient.query.mockResolvedValue(Result.ok(persistence));
      mockUserMapper.persistenceToDto.mockReturnValue(userDto);

      const result = await dataSource.getSessionUser();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(userDto);
      }
      expect(mockAuthClient.authenticate).toHaveBeenCalled();
    });

    it('should return error when authentication fails', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.fail({
          code: 'UNAUTHORIZED',
          status: 401,
          message: 'Not authenticated',
        }),
      );

      const result = await dataSource.getSessionUser();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Not authenticated');
      }
      expect(mockDbClient.query).not.toHaveBeenCalled();
    });

    it('should return error when getById fails', async () => {
      mockAuthClient.authenticate.mockResolvedValue(Result.ok(authIdentity));
      mockDbClient.query.mockResolvedValue(
        Result.fail({ message: 'User not found' }),
      );

      const result = await dataSource.getSessionUser();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('User not found');
      }
    });
  });
});
