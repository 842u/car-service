import type { AuthClient } from '@/common/application/auth-client';
import { Result } from '@/common/application/result';
import { createMockAuthIdentity } from '@/lib/jest/mock/@supabase/auth';
import { createMockAuthClient } from '@/lib/jest/mock/src/common/application/auth-client';
import { createMockUserMapper } from '@/lib/jest/mock/src/module/user/application/mapper/user';
import { createMockUserRepository } from '@/lib/jest/mock/src/module/user/application/user-repository';
import { createMockUser } from '@/lib/jest/mock/src/module/user/domain/user/user';
import type { UserDto } from '@/user/application/dto/user';
import type { UserMapper } from '@/user/application/mapper/user';
import type { UserRepository } from '@/user/application/repository/user';
import { NameChangeUseCase } from '@/user/application/use-case/name-change';
import type { NameChangeApiRequest } from '@/user/interface/api/name-change.schema';

describe('NameChangeUseCase', () => {
  let useCase: NameChangeUseCase;
  let mockAuthClient: jest.Mocked<AuthClient>;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockUserMapper: jest.Mocked<UserMapper>;

  beforeEach(() => {
    mockAuthClient = createMockAuthClient();
    mockUserRepository = createMockUserRepository();
    mockUserMapper = createMockUserMapper();
    useCase = new NameChangeUseCase(
      mockAuthClient,
      mockUserRepository,
      mockUserMapper,
    );
  });

  describe('execute', () => {
    const validContract = { name: 'New Name' };

    const mockAuthIdentity = createMockAuthIdentity();

    const mockUserDto: UserDto = {
      id: '44dd8410-a912-480f-95be-9ad4cbe30d7f',
      email: 'test@example.com',
      name: 'New Name',
      avatarUrl: null,
    };

    it('should change the user name successfully', async () => {
      const mockUser = createMockUser();

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );

      mockUserRepository.getById.mockResolvedValue(Result.ok(mockUser));

      mockUserRepository.update.mockResolvedValue(Result.ok(null));

      mockUserMapper.domainToDto.mockReturnValue(mockUserDto);

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(mockUserDto);
      }

      expect(mockAuthClient.authenticate).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.getById).toHaveBeenCalledWith(
        mockAuthIdentity.id,
      );
      expect(mockUser.name.value).toBe(validContract.name);
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);
      expect(mockUserMapper.domainToDto).toHaveBeenCalledWith(mockUser);
    });

    it('should fail as unauthorized when authentication fails', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.fail({ message: 'Unauthorized', code: '', status: 401 }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Unauthorized');
        expect(result.error.kind).toBe('unauthorized');
      }

      expect(mockAuthClient.authenticate).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.getById).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should fail as unexpected when user retrieval fails', async () => {
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
        expect(result.error.kind).toBe('unexpected');
      }

      expect(mockAuthClient.authenticate).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.getById).toHaveBeenCalledWith(
        mockAuthIdentity.id,
      );
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should fail as validation when name change validation fails', async () => {
      const mockUser = createMockUser();
      const invalidContract: NameChangeApiRequest = {
        name: '',
      };

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );

      mockUserRepository.getById.mockResolvedValue(Result.ok(mockUser));

      const result = await useCase.execute(invalidContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('validation');
        expect(result.error.message).toBeDefined();
      }

      expect(mockAuthClient.authenticate).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.getById).toHaveBeenCalledWith(
        mockAuthIdentity.id,
      );
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should fail as unexpected when persistence fails', async () => {
      const mockUser = createMockUser();

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );

      mockUserRepository.getById.mockResolvedValue(Result.ok(mockUser));

      mockUserRepository.update.mockResolvedValue(
        Result.fail({ message: 'Database error' }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Database error');
        expect(result.error.kind).toBe('unexpected');
      }

      expect(mockAuthClient.authenticate).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.getById).toHaveBeenCalledWith(
        mockAuthIdentity.id,
      );
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);
    });
  });
});
