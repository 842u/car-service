import type { AuthClient } from '@/common/application/auth-client';
import { Result } from '@/common/application/result';
import { ValidatorError } from '@/common/application/validator';
import { createMockAuthIdentity } from '@/lib/jest/mock/@supabase/auth';
import { createMockAuthClient } from '@/lib/jest/mock/src/common/application/auth-client';
import { createMockUserMapper } from '@/lib/jest/mock/src/module/user/application/mapper/user';
import { createMockUser } from '@/lib/jest/mock/src/module/user/domain/user/user';
import type { UserMapper } from '@/user/application/mapper/user';
import { SignInWithOtpUseCase } from '@/user/application/use-case/sign-in-with-otp';

describe('SignInWithOtpUseCase', () => {
  let useCase: SignInWithOtpUseCase;
  let mockAuthClient: jest.Mocked<AuthClient>;
  let mockUserMapper: jest.Mocked<UserMapper>;

  beforeEach(() => {
    mockAuthClient = createMockAuthClient();
    mockUserMapper = createMockUserMapper();
    useCase = new SignInWithOtpUseCase(mockAuthClient, mockUserMapper);
  });

  describe('execute', () => {
    const validContract = {
      token_hash: 'valid-token-hash',
      type: 'email',
    };

    const mockAuthIdentity = createMockAuthIdentity();

    it('should sign in successfully with valid OTP', async () => {
      const mockUser = createMockUser();
      mockAuthClient.verifyOtp.mockResolvedValue(Result.ok(mockAuthIdentity));
      mockUserMapper.authIdentityToDomain.mockReturnValue(Result.ok(mockUser));

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(mockUser);
      }
      expect(mockAuthClient.verifyOtp).toHaveBeenCalledWith({
        type: validContract.type,
        token_hash: validContract.token_hash,
      });
      expect(mockUserMapper.authIdentityToDomain).toHaveBeenCalledWith(
        mockAuthIdentity,
      );
    });

    it('should fail when OTP verification fails', async () => {
      mockAuthClient.verifyOtp.mockResolvedValue(
        Result.fail({
          message: 'Invalid OTP',
          status: 400,
          code: 'invalid_otp',
        }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Invalid OTP');
      }
      expect(mockAuthClient.verifyOtp).toHaveBeenCalledWith({
        type: validContract.type,
        token_hash: validContract.token_hash,
      });
      expect(mockUserMapper.authIdentityToDomain).not.toHaveBeenCalled();
    });

    it('should fail when user mapping fails', async () => {
      mockAuthClient.verifyOtp.mockResolvedValue(Result.ok(mockAuthIdentity));
      mockUserMapper.authIdentityToDomain.mockReturnValue(
        Result.fail(new ValidatorError('Mapping failed', [])),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Mapping failed');
      }
      expect(mockAuthClient.verifyOtp).toHaveBeenCalledWith({
        type: validContract.type,
        token_hash: validContract.token_hash,
      });
      expect(mockUserMapper.authIdentityToDomain).toHaveBeenCalledWith(
        mockAuthIdentity,
      );
    });
  });
});
