import type { AuthClient } from '@/common/application/auth-client';
import { Result } from '@/common/application/result';
import { createMockAuthIdentity } from '@/lib/jest/mock/@supabase/auth';
import { createMockAuthClient } from '@/lib/jest/mock/src/common/application/auth-client';
import { createMockUserRepository } from '@/lib/jest/mock/src/module/user/application/user-repository';
import { createMockUser } from '@/lib/jest/mock/src/module/user/domain/user/user';
import type { UserRepository } from '@/user/application/repository/user';
import { AvatarUrlChangeUseCase } from '@/user/application/use-case/avatar-url-change';
import type { AvatarUrlChangeApiRequest } from '@/user/interface/api/avatar-change.schema';

describe('AvatarUrlChangeUseCase', () => {
  let useCase: AvatarUrlChangeUseCase;
  let mockAuthClient: jest.Mocked<AuthClient>;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockAuthClient = createMockAuthClient();
    mockUserRepository = createMockUserRepository();
    useCase = new AvatarUrlChangeUseCase(mockAuthClient, mockUserRepository);
  });

  describe('execute', () => {
    const validContract: AvatarUrlChangeApiRequest = {
      avatarUrl: 'https://example.com/avatar.jpg',
    };

    const mockAuthIdentity = createMockAuthIdentity();

    it('should successfully change avatar URL', async () => {
      const mockUser = createMockUser();

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );

      mockUserRepository.getById.mockResolvedValue(Result.ok(mockUser));

      mockUserRepository.changeAvatarUrl.mockResolvedValue(Result.ok(null));

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(mockUser);
        expect(result.data.avatarUrl?.value).toBe(validContract.avatarUrl);
      }

      expect(mockAuthClient.authenticate).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.getById).toHaveBeenCalledWith(
        mockAuthIdentity.id,
      );
      expect(mockUserRepository.changeAvatarUrl).toHaveBeenCalledWith(mockUser);
    });

    it('should fail when authentication fails', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.fail({ message: 'Unauthorized', code: '', status: 401 }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Unauthorized');
        expect(result.error.code).toBe(401);
      }

      expect(mockAuthClient.authenticate).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.getById).not.toHaveBeenCalled();
      expect(mockUserRepository.changeAvatarUrl).not.toHaveBeenCalled();
    });

    it('should use default 401 code when auth fails without status', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.fail({ message: 'Unauthorized', status: 401, code: '' }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(401);
      }
    });

    it('should fail when user not found', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );

      mockUserRepository.getById.mockResolvedValue(
        Result.fail({ message: 'User not found' }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('User not found');
        expect(result.error.code).toBe(500);
      }

      expect(mockAuthClient.authenticate).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.getById).toHaveBeenCalledWith(
        mockAuthIdentity.id,
      );
      expect(mockUserRepository.changeAvatarUrl).not.toHaveBeenCalled();
    });

    it('should fail when avatar URL is invalid', async () => {
      const mockUser = createMockUser();
      const invalidContract: AvatarUrlChangeApiRequest = {
        avatarUrl: 'invalid-url',
      };

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );

      mockUserRepository.getById.mockResolvedValue(Result.ok(mockUser));

      const result = await useCase.execute(invalidContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(400);
        expect(result.error.message).toBeDefined();
      }

      expect(mockAuthClient.authenticate).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.getById).toHaveBeenCalledWith(
        mockAuthIdentity.id,
      );
      expect(mockUserRepository.changeAvatarUrl).not.toHaveBeenCalled();
    });

    it('should fail when persistence fails', async () => {
      const mockUser = createMockUser();

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );

      mockUserRepository.getById.mockResolvedValue(Result.ok(mockUser));

      mockUserRepository.changeAvatarUrl.mockResolvedValue(
        Result.fail({ message: 'Database error' }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Database error');
        expect(result.error.code).toBe(500);
      }

      expect(mockAuthClient.authenticate).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.getById).toHaveBeenCalledWith(
        mockAuthIdentity.id,
      );
      expect(mockUserRepository.changeAvatarUrl).toHaveBeenCalledWith(mockUser);
    });
  });
});
