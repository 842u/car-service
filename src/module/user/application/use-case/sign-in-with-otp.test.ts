import type { AuthClient } from '@/common/application/auth-client';
import { createMockAuthClient } from '@/common/application/auth-client.mock';
import { Result } from '@/common/application/result';
import { ValidatorError } from '@/common/application/validator';
import { createMockAuthIdentity } from '@/test/mock/@supabase/auth';
import type { UserDto } from '@/user/application/dto/user';
import type { UserMapper } from '@/user/application/mapper/user';
import { createMockUserMapper } from '@/user/application/mapper/user.mock';
import { SignInWithOtpUseCase } from '@/user/application/use-case/sign-in-with-otp';
import { buildUser } from '@/user/domain/user/user.builder';

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

    const mockUserDto: UserDto = {
      id: '44dd8410-a912-480f-95be-9ad4cbe30d7f',
      email: 'test@example.com',
      name: 'Test User',
      avatarUrl: null,
    };

    it('should sign in successfully with valid OTP', async () => {
      const mockUser = buildUser();
      mockAuthClient.verifyOtp.mockResolvedValue(Result.ok(mockAuthIdentity));
      mockUserMapper.authIdentityToDomain.mockReturnValue(Result.ok(mockUser));
      mockUserMapper.domainToDto.mockReturnValue(mockUserDto);

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(mockUserDto);
      }
      expect(mockAuthClient.verifyOtp).toHaveBeenCalledWith({
        type: validContract.type,
        token_hash: validContract.token_hash,
      });
      expect(mockUserMapper.authIdentityToDomain).toHaveBeenCalledWith(
        mockAuthIdentity,
      );
      expect(mockUserMapper.domainToDto).toHaveBeenCalledWith(mockUser);
    });

    it('should fail as unauthorized when OTP verification fails', async () => {
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
        expect(result.error.kind).toBe('unauthorized');
      }
      expect(mockAuthClient.verifyOtp).toHaveBeenCalledWith({
        type: validContract.type,
        token_hash: validContract.token_hash,
      });
      expect(mockUserMapper.authIdentityToDomain).not.toHaveBeenCalled();
    });

    it('should fail as unexpected when user mapping fails', async () => {
      mockAuthClient.verifyOtp.mockResolvedValue(Result.ok(mockAuthIdentity));
      mockUserMapper.authIdentityToDomain.mockReturnValue(
        Result.fail(new ValidatorError('Mapping failed', [])),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Mapping failed');
        expect(result.error.kind).toBe('unexpected');
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
