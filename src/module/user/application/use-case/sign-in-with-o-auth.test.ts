import type { AuthClient } from '@/common/application/auth-client';
import { Result } from '@/common/application/result';
import { ValidatorError } from '@/common/application/validator';
import { createMockAuthIdentity } from '@/lib/jest/mock/@supabase/auth';
import { createMockAuthClient } from '@/lib/jest/mock/src/common/application/auth-client';
import { createMockUserMapper } from '@/lib/jest/mock/src/module/user/application/mapper/user';
import { createMockUserRepository } from '@/lib/jest/mock/src/module/user/application/user-repository';
import { createMockUser } from '@/lib/jest/mock/src/module/user/domain/user/user';
import type { UserMapper } from '@/user/application/mapper/user';
import type { UserRepository } from '@/user/application/repository/user';
import { SignInWithOAuthUseCase } from '@/user/application/use-case/sign-in-with-o-auth';

describe('SignInWithOAuthUseCase', () => {
  let useCase: SignInWithOAuthUseCase;
  let mockAuthClient: jest.Mocked<AuthClient>;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockUserMapper: jest.Mocked<UserMapper>;

  beforeEach(() => {
    mockAuthClient = createMockAuthClient();
    mockUserRepository = createMockUserRepository();
    mockUserMapper = createMockUserMapper();
    useCase = new SignInWithOAuthUseCase(
      mockAuthClient,
      mockUserRepository,
      mockUserMapper,
    );
  });

  describe('execute', () => {
    const validContract = { code: 'valid-code' };

    const mockAuthIdentity = createMockAuthIdentity();

    it('should sign in successfully with existing user', async () => {
      const mockUser = createMockUser();
      mockAuthClient.exchangeCodeForSession.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );
      mockUserRepository.getById.mockResolvedValue(Result.ok(mockUser));

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(mockUser);
      }
      expect(mockAuthClient.exchangeCodeForSession).toHaveBeenCalledWith(
        validContract.code,
      );
      expect(mockUserRepository.getById).toHaveBeenCalledWith(
        mockAuthIdentity.id,
      );
      expect(mockUserRepository.store).not.toHaveBeenCalled();
    });

    it('should sign in successfully and create new user if not exists', async () => {
      const mockUser = createMockUser();
      mockAuthClient.exchangeCodeForSession.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );
      mockUserRepository.getById.mockResolvedValue(
        Result.fail({ message: 'User not found' }),
      );
      mockUserMapper.authIdentityToDomain.mockReturnValue(Result.ok(mockUser));
      mockUserRepository.store.mockResolvedValue(Result.ok(null));

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(mockUser);
      }
      expect(mockAuthClient.exchangeCodeForSession).toHaveBeenCalledWith(
        validContract.code,
      );
      expect(mockUserRepository.store).toHaveBeenCalledWith(mockUser);
    });

    it('should fail when code exchange fails', async () => {
      mockAuthClient.exchangeCodeForSession.mockResolvedValue(
        Result.fail({ message: 'Invalid code', code: '', status: 400 }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Invalid code');
        expect(result.error.code).toBe(400);
      }
      expect(mockAuthClient.exchangeCodeForSession).toHaveBeenCalledWith(
        validContract.code,
      );
      expect(mockUserRepository.getById).not.toHaveBeenCalled();
      expect(mockUserRepository.store).not.toHaveBeenCalled();
    });

    it('should fail when user mapping fails', async () => {
      mockAuthClient.exchangeCodeForSession.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );
      mockUserRepository.getById.mockResolvedValue(
        Result.fail({ message: 'User not found' }),
      );
      mockUserMapper.authIdentityToDomain.mockReturnValue(
        Result.fail(
          new ValidatorError('Mapping failed', [
            { message: 'Invalid data', path: ['id'] },
          ]),
        ),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Mapping failed');
        expect(result.error.code).toBe(500);
      }

      expect(mockAuthClient.exchangeCodeForSession).toHaveBeenCalledWith(
        validContract.code,
      );
      expect(mockUserRepository.store).not.toHaveBeenCalled();
    });

    it('should fail when user persistence fails', async () => {
      const mockUser = createMockUser();
      mockAuthClient.exchangeCodeForSession.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );
      mockUserRepository.getById.mockResolvedValue(
        Result.fail({ message: 'User not found' }),
      );
      mockUserMapper.authIdentityToDomain.mockReturnValue(Result.ok(mockUser));
      mockUserRepository.store.mockResolvedValue(
        Result.fail({ message: 'Database error' }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Database error');
        expect(result.error.code).toBe(500);
      }
      expect(mockAuthClient.exchangeCodeForSession).toHaveBeenCalledWith(
        validContract.code,
      );
      expect(mockUserRepository.getById).toHaveBeenCalledWith(
        mockAuthIdentity.id,
      );
      expect(mockUserRepository.store).toHaveBeenCalledWith(mockUser);
    });
  });
});
