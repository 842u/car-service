import type { AuthClient } from '@/common/application/auth-client';
import { Result } from '@/common/application/result';
import { createMockAuthClient } from '@/lib/jest/mock/src/common/application/auth-client';
import { createMockUserMapper } from '@/lib/jest/mock/src/module/user/application/mapper/user';
import { createMockUserRepository } from '@/lib/jest/mock/src/module/user/application/user-repository';
import { createMockUser } from '@/lib/jest/mock/src/module/user/domain/user/user';
import { createMockAuthIdentity } from '@/test/mock/@supabase/auth';
import type { UserDto } from '@/user/application/dto/user';
import type { UserMapper } from '@/user/application/mapper/user';
import type { UserRepository } from '@/user/application/repository/user';
import { PasswordChangeUseCase } from '@/user/application/use-case/password-change';
import type { PasswordChangeApiRequest } from '@/user/interface/api/password-change.schema';

describe('PasswordChangeUseCase', () => {
  let useCase: PasswordChangeUseCase;
  let mockAuthClient: jest.Mocked<AuthClient>;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockUserMapper: jest.Mocked<UserMapper>;

  beforeEach(() => {
    mockAuthClient = createMockAuthClient();
    mockUserRepository = createMockUserRepository();
    mockUserMapper = createMockUserMapper();
    useCase = new PasswordChangeUseCase(
      mockAuthClient,
      mockUserRepository,
      mockUserMapper,
    );
  });

  describe('execute', () => {
    const newPassword = 'newPassword456';

    const validContract: PasswordChangeApiRequest = {
      password: newPassword,
      passwordConfirm: newPassword,
    };

    const mockAuthIdentity = createMockAuthIdentity();

    const mockUserDto: UserDto = {
      id: '44dd8410-a912-480f-95be-9ad4cbe30d7f',
      email: 'test@example.com',
      name: 'Test User',
      avatarUrl: null,
    };

    it('should successfully change password', async () => {
      const mockUser = createMockUser();

      mockAuthClient.changePassword.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );

      mockUserRepository.getById.mockResolvedValue(Result.ok(mockUser));

      mockUserMapper.domainToDto.mockReturnValue(mockUserDto);

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(mockUserDto);
      }

      expect(mockAuthClient.changePassword).toHaveBeenCalledWith({
        password: newPassword,
      });
      expect(mockUserRepository.getById).toHaveBeenCalledWith(
        mockAuthIdentity.id,
      );
      expect(mockUserMapper.domainToDto).toHaveBeenCalledWith(mockUser);
    });

    it('should fail as validation when passwords do not match', async () => {
      const invalidContract: PasswordChangeApiRequest = {
        password: newPassword,
        passwordConfirm: 'differentPassword',
      };

      const result = await useCase.execute(invalidContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Passwords do not match.');
        expect(result.error.kind).toBe('validation');
      }

      expect(mockAuthClient.changePassword).not.toHaveBeenCalled();
      expect(mockUserRepository.getById).not.toHaveBeenCalled();
    });

    it('should fail as validation when password validation fails', async () => {
      const invalidPassword = 'short';

      const invalidContract: PasswordChangeApiRequest = {
        password: invalidPassword,
        passwordConfirm: invalidPassword,
      };

      const result = await useCase.execute(invalidContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('validation');
      }

      expect(mockAuthClient.changePassword).not.toHaveBeenCalled();
      expect(mockUserRepository.getById).not.toHaveBeenCalled();
    });

    it('should fail as unauthorized when password change fails', async () => {
      mockAuthClient.changePassword.mockResolvedValue(
        Result.fail({ message: 'Unauthorized', code: '', status: 401 }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Unauthorized');
        expect(result.error.kind).toBe('unauthorized');
      }

      expect(mockAuthClient.changePassword).toHaveBeenCalledWith({
        password: newPassword,
      });
      expect(mockUserRepository.getById).not.toHaveBeenCalled();
    });

    it('should fail as unexpected when user retrieval fails', async () => {
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
        expect(result.error.kind).toBe('unexpected');
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
