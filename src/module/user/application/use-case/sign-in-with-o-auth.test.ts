import type { AuthClient } from '@/common/application/auth-client';
import { createMockAuthClient } from '@/common/application/auth-client.mock';
import { Result } from '@/common/application/result';
import { ValidatorError } from '@/common/application/validator';
import { createMockAuthIdentity } from '@/test/mock/@supabase/auth';
import type { UserDto } from '@/user/application/dto/user';
import type { UserMapper } from '@/user/application/mapper/user';
import { createMockUserMapper } from '@/user/application/mapper/user.mock';
import type { UserRepository } from '@/user/application/repository/user';
import { createMockUserRepository } from '@/user/application/repository/user.mock';
import { SignInWithOAuthUseCase } from '@/user/application/use-case/sign-in-with-o-auth';
import { buildUser } from '@/user/domain/user/user.builder';

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

    const mockUserDto: UserDto = {
      id: '44dd8410-a912-480f-95be-9ad4cbe30d7f',
      email: 'test@example.com',
      name: 'Test User',
      avatarUrl: null,
    };

    it('should sign in successfully with existing user', async () => {
      const mockUser = buildUser();
      mockAuthClient.exchangeCodeForSession.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );
      mockUserRepository.getById.mockResolvedValue(Result.ok(mockUser));
      mockUserMapper.domainToDto.mockReturnValue(mockUserDto);

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(mockUserDto);
      }
      expect(mockAuthClient.exchangeCodeForSession).toHaveBeenCalledWith(
        validContract.code,
      );
      expect(mockUserRepository.getById).toHaveBeenCalledWith(
        mockAuthIdentity.id,
      );
      expect(mockUserMapper.domainToDto).toHaveBeenCalledWith(mockUser);
      expect(mockUserRepository.store).not.toHaveBeenCalled();
    });

    it('should sign in successfully and create new user if not exists', async () => {
      const mockUser = buildUser();
      mockAuthClient.exchangeCodeForSession.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );
      mockUserRepository.getById.mockResolvedValue(
        Result.fail({ message: 'User not found' }),
      );
      mockUserMapper.authIdentityToDomain.mockReturnValue(Result.ok(mockUser));
      mockUserRepository.store.mockResolvedValue(Result.ok(null));
      mockUserMapper.domainToDto.mockReturnValue(mockUserDto);

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(mockUserDto);
      }
      expect(mockAuthClient.exchangeCodeForSession).toHaveBeenCalledWith(
        validContract.code,
      );
      expect(mockUserRepository.store).toHaveBeenCalledWith(mockUser);
      expect(mockUserMapper.domainToDto).toHaveBeenCalledWith(mockUser);
    });

    it('should fail as unauthorized when code exchange fails', async () => {
      mockAuthClient.exchangeCodeForSession.mockResolvedValue(
        Result.fail({ message: 'Invalid code', code: '', status: 400 }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Invalid code');
        expect(result.error.kind).toBe('unauthorized');
      }
      expect(mockAuthClient.exchangeCodeForSession).toHaveBeenCalledWith(
        validContract.code,
      );
      expect(mockUserRepository.getById).not.toHaveBeenCalled();
      expect(mockUserRepository.store).not.toHaveBeenCalled();
    });

    it('should fail as unexpected when user mapping fails', async () => {
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
        expect(result.error.kind).toBe('unexpected');
      }

      expect(mockAuthClient.exchangeCodeForSession).toHaveBeenCalledWith(
        validContract.code,
      );
      expect(mockUserRepository.store).not.toHaveBeenCalled();
    });

    it('should fail as unexpected when user persistence fails', async () => {
      const mockUser = buildUser();
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
        expect(result.error.kind).toBe('unexpected');
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
