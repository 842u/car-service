import type { AuthClient } from '@/common/application/auth-client';
import { Result } from '@/common/application/result';
import { createMockAuthIdentity } from '@/lib/jest/mock/@supabase/auth';
import { createMockAuthClient } from '@/lib/jest/mock/src/common/application/auth-client';
import { createMockUserRepository } from '@/lib/jest/mock/src/module/user/application/user-repository';
import { createMockUser } from '@/lib/jest/mock/src/module/user/domain/user/user';
import type { UserRepository } from '@/user/application/repository/user';
import { PasswordChangeUseCase } from '@/user/application/use-case/password-change';
import type { PasswordChangeApiRequest } from '@/user/interface/api/password-change.schema';

describe('PasswordChangeUseCase', () => {
  let useCase: PasswordChangeUseCase;
  let mockAuthClient: jest.Mocked<AuthClient>;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockAuthClient = createMockAuthClient();
    mockUserRepository = createMockUserRepository();
    useCase = new PasswordChangeUseCase(mockAuthClient, mockUserRepository);
  });

  describe('execute', () => {
    const newPassword = 'newPassword456';

    const validContract: PasswordChangeApiRequest = {
      password: newPassword,
      passwordConfirm: newPassword,
    };

    const mockAuthIdentity = createMockAuthIdentity();

    it('should successfully change password', async () => {
      const mockUser = createMockUser();

      mockAuthClient.changePassword.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );

      mockUserRepository.getById.mockResolvedValue(Result.ok(mockUser));

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(mockUser);
      }

      expect(mockAuthClient.changePassword).toHaveBeenCalledWith({
        password: newPassword,
      });
    });

    it('should fail when passwords do not match', async () => {
      const invalidContract: PasswordChangeApiRequest = {
        password: newPassword,
        passwordConfirm: 'differentPassword',
      };

      const result = await useCase.execute(invalidContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Passwords do not match.');
        expect(result.error.code).toBe(400);
      }

      expect(mockAuthClient.changePassword).not.toHaveBeenCalled();
      expect(mockUserRepository.getById).not.toHaveBeenCalled();
    });

    it('should fail when password validation fails', async () => {
      const invalidPassword = 'short';

      const invalidContract: PasswordChangeApiRequest = {
        password: invalidPassword,
        passwordConfirm: invalidPassword,
      };

      const result = await useCase.execute(invalidContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(422);
      }

      expect(mockAuthClient.changePassword).not.toHaveBeenCalled();
      expect(mockUserRepository.getById).not.toHaveBeenCalled();
    });

    it('should fail when password change fails', async () => {
      mockAuthClient.changePassword.mockResolvedValue(
        Result.fail({ message: 'Unauthorized', code: '', status: 401 }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Unauthorized');
        expect(result.error.code).toBe(401);
      }

      expect(mockAuthClient.changePassword).toHaveBeenCalledWith({
        password: newPassword,
      });
      expect(mockUserRepository.getById).not.toHaveBeenCalled();
    });

    it('should fail when user retrieval fails', async () => {
      mockAuthClient.changePassword.mockResolvedValue(
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

      expect(mockAuthClient.changePassword).toHaveBeenCalledWith({
        password: newPassword,
      });
      expect(mockUserRepository.getById).toHaveBeenCalledWith(
        mockAuthIdentity.id,
      );
    });
  });
});
