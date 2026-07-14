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
import { SignInUseCase } from '@/user/application/use-case/sign-in';
import type { SignInApiRequest } from '@/user/interface/api/sign-in.schema';

describe('SignInUseCase', () => {
  let useCase: SignInUseCase;
  let mockAuthClient: jest.Mocked<AuthClient>;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockUserMapper: jest.Mocked<UserMapper>;

  beforeEach(() => {
    mockAuthClient = createMockAuthClient();
    mockUserRepository = createMockUserRepository();
    mockUserMapper = createMockUserMapper();
    useCase = new SignInUseCase(
      mockAuthClient,
      mockUserRepository,
      mockUserMapper,
    );
  });

  describe('execute', () => {
    const validContract: SignInApiRequest = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockAuthIdentity = createMockAuthIdentity();

    const mockUserDto: UserDto = {
      id: '44dd8410-a912-480f-95be-9ad4cbe30d7f',
      email: 'test@example.com',
      name: 'Test User',
      avatarUrl: null,
    };

    it('should sign in successfully', async () => {
      const mockUser = createMockUser();

      mockAuthClient.signIn.mockResolvedValue(Result.ok(mockAuthIdentity));
      mockUserRepository.getById.mockResolvedValue(Result.ok(mockUser));
      mockUserMapper.domainToDto.mockReturnValue(mockUserDto);

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(mockUserDto);
      }

      expect(mockAuthClient.signIn).toHaveBeenCalledWith({
        email: validContract.email,
        password: validContract.password,
      });
      expect(mockUserRepository.getById).toHaveBeenCalledWith(
        mockAuthIdentity.id,
      );
      expect(mockUserMapper.domainToDto).toHaveBeenCalledWith(mockUser);
    });

    it('should fail as unauthorized when sign-in fails', async () => {
      mockAuthClient.signIn.mockResolvedValue(
        Result.fail({ message: 'Invalid credentials', code: '', status: 401 }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Invalid credentials');
        expect(result.error.kind).toBe('unauthorized');
      }

      expect(mockAuthClient.signIn).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.getById).not.toHaveBeenCalled();
    });

    it('should fail as unexpected when user retrieval fails', async () => {
      mockAuthClient.signIn.mockResolvedValue(Result.ok(mockAuthIdentity));
      mockUserRepository.getById.mockResolvedValue(
        Result.fail({ message: 'User not found' }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('User not found');
        expect(result.error.kind).toBe('unexpected');
      }

      expect(mockAuthClient.signIn).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.getById).toHaveBeenCalledWith(
        mockAuthIdentity.id,
      );
    });
  });
});
