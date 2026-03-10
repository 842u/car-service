import type { AdminAuthClient } from '@/common/application/auth-client';
import { Result } from '@/common/application/result';
import { ValidatorError } from '@/common/application/validator';
import { createMockAuthIdentity } from '@/lib/jest/mock/@supabase/auth';
import { createMockAdminAuthClient } from '@/lib/jest/mock/src/common/application/auth-client';
import { createMockUserMapper } from '@/lib/jest/mock/src/module/user/application/mapper/user';
import { createMockUserRepository } from '@/lib/jest/mock/src/module/user/application/user-repository';
import { createMockUser } from '@/lib/jest/mock/src/module/user/domain/user/user';
import type { UserMapper } from '@/user/application/mapper/user';
import type { UserRepository } from '@/user/application/repository/user';
import { SignUpUseCase } from '@/user/application/use-case/sign-up';

describe('SignUpUseCase', () => {
  let mockAdminAuthClient: jest.Mocked<AdminAuthClient>;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockUserMapper: jest.Mocked<UserMapper>;
  let useCase: SignUpUseCase;

  beforeEach(() => {
    mockAdminAuthClient = createMockAdminAuthClient();
    mockUserRepository = createMockUserRepository();
    mockUserMapper = createMockUserMapper();
    useCase = new SignUpUseCase(
      mockAdminAuthClient,
      mockUserRepository,
      mockUserMapper,
      'https://preview-branch.vercel.app',
    );
  });

  describe('execute', () => {
    const mockUser = createMockUser();
    const mockAuthIdentity = createMockAuthIdentity();
    const contract = {
      email: mockUser.email.value,
      password: 'password123',
    };
    it('should sign up successfully', async () => {
      mockAdminAuthClient.createAuthIdentity.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );
      mockUserMapper.authIdentityToDomain.mockReturnValue(Result.ok(mockUser));
      mockAdminAuthClient.sendConfirmationEmail.mockResolvedValue(
        Result.ok(null),
      );
      mockUserRepository.store.mockResolvedValue(Result.ok(null));

      const result = await useCase.execute(contract);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockUser);
      }
      expect(mockAdminAuthClient.createAuthIdentity).toHaveBeenCalledWith({
        ...contract,
        email_confirm: false,
      });
      expect(mockUserRepository.store).toHaveBeenCalledWith(mockUser);
      expect(mockAdminAuthClient.sendConfirmationEmail).toHaveBeenCalledWith({
        email: contract.email,
        redirectTo: 'https://preview-branch.vercel.app/api/auth/otp',
      });
    });

    it('should send password reset email if user already exists', async () => {
      mockAdminAuthClient.createAuthIdentity.mockResolvedValue(
        Result.fail({
          message: 'User already exists',
          code: 'user_already_exists',
          status: 400,
        }),
      );
      mockAdminAuthClient.resetPassword.mockResolvedValue(Result.ok(null));

      const result = await useCase.execute(contract);

      expect(result.success).toBe(true);
      expect(mockAdminAuthClient.resetPassword).toHaveBeenCalledWith({
        email: contract.email,
        options: {
          redirectTo: 'https://preview-branch.vercel.app/dashboard',
        },
      });
    });

    it('should fail if cannot create auth identity for reasons other than existing user', async () => {
      mockAdminAuthClient.createAuthIdentity.mockResolvedValue(
        Result.fail({
          message: 'Database error',
          code: 'database_error',
          status: 500,
        }),
      );

      const result = await useCase.execute(contract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Database error');
        expect(result.error.code).toBe(500);
      }
      expect(mockAdminAuthClient.createAuthIdentity).toHaveBeenCalledWith({
        ...contract,
        email_confirm: false,
      });
      expect(mockAdminAuthClient.resetPassword).not.toHaveBeenCalled();
    });

    it('should fail if sending password reset email fails', async () => {
      mockAdminAuthClient.createAuthIdentity.mockResolvedValue(
        Result.fail({
          message: 'User already exists',
          code: 'user_already_exists',
          status: 400,
        }),
      );
      mockAdminAuthClient.resetPassword.mockResolvedValue(
        Result.fail({
          message: 'Email service error',
          code: 'email_service_error',
          status: 500,
        }),
      );

      const result = await useCase.execute(contract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Email service error');
        expect(result.error.code).toBe(500);
      }
      expect(mockAdminAuthClient.resetPassword).toHaveBeenCalledWith({
        email: contract.email,
        options: {
          redirectTo: 'https://preview-branch.vercel.app/dashboard',
        },
      });
    });

    it('should fail and delete created auth identity if user creation fails', async () => {
      mockAdminAuthClient.createAuthIdentity.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );
      mockUserMapper.authIdentityToDomain.mockReturnValue(
        Result.fail(new ValidatorError('Invalid user data', [])),
      );
      mockAdminAuthClient.deleteAuthIdentity.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );

      const result = await useCase.execute(contract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Invalid user data');
        expect(result.error.code).toBe(422);
      }
      expect(mockAdminAuthClient.createAuthIdentity).toHaveBeenCalledWith({
        ...contract,
        email_confirm: false,
      });
      expect(mockAdminAuthClient.deleteAuthIdentity).toHaveBeenCalledWith({
        id: mockAuthIdentity.id,
      });
      expect(mockUserRepository.store).not.toHaveBeenCalled();
    });

    it('should fail and delete created auth identity if sending confirmation email fails', async () => {
      mockAdminAuthClient.createAuthIdentity.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );
      mockUserMapper.authIdentityToDomain.mockReturnValue(Result.ok(mockUser));
      mockUserRepository.store.mockResolvedValue(Result.ok(null));
      mockAdminAuthClient.sendConfirmationEmail.mockResolvedValue(
        Result.fail({
          message: 'Email service error',
          code: 'email_service_error',
          status: 500,
        }),
      );

      const result = await useCase.execute(contract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Email service error');
        expect(result.error.code).toBe(500);
      }
      expect(mockAdminAuthClient.sendConfirmationEmail).toHaveBeenCalledWith({
        email: contract.email,
        redirectTo: 'https://preview-branch.vercel.app/api/auth/otp',
      });
      expect(mockUserRepository.store).toHaveBeenCalledWith(mockUser);
      expect(mockAdminAuthClient.deleteAuthIdentity).toHaveBeenCalledWith({
        id: mockAuthIdentity.id,
      });
    });
  });
});
