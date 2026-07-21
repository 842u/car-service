import type { AuthClient } from '@/common/application/auth-client';
import { createMockAuthClient } from '@/common/application/auth-client.mock';
import { Result } from '@/common/application/result';
import { createMockAuthIdentity } from '@/test/mock/@supabase/auth';
import type { UserDto } from '@/user/application/dto/user';
import type { UserMapper } from '@/user/application/mapper/user';
import { createMockUserMapper } from '@/user/application/mapper/user.mock';
import type { UserRepository } from '@/user/application/repository/user';
import { createMockUserRepository } from '@/user/application/repository/user.mock';
import { EditUserUseCase } from '@/user/application/use-case/edit';
import { buildUser } from '@/user/domain/user/user.builder';
import type { EditUserApiRequest } from '@/user/interface/api/edit.schema';

describe('EditUserUseCase', () => {
  let useCase: EditUserUseCase;
  let mockAuthClient: jest.Mocked<AuthClient>;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockUserMapper: jest.Mocked<UserMapper>;

  beforeEach(() => {
    mockAuthClient = createMockAuthClient();
    mockUserRepository = createMockUserRepository();
    mockUserMapper = createMockUserMapper();
    useCase = new EditUserUseCase(
      mockAuthClient,
      mockUserRepository,
      mockUserMapper,
    );
  });

  describe('execute', () => {
    const validContract: EditUserApiRequest = { name: 'New Name' };

    const mockAuthIdentity = createMockAuthIdentity();

    const mockUserDto: UserDto = {
      id: '44dd8410-a912-480f-95be-9ad4cbe30d7f',
      email: 'test@example.com',
      name: 'New Name',
      avatarUrl: null,
    };

    it('should change the user name successfully', async () => {
      const mockUser = buildUser();

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

    it('changes both the name and the avatar url when both are present', async () => {
      const mockUser = buildUser();
      const contract: EditUserApiRequest = {
        name: 'New Name',
        avatarUrl: 'https://example.com/avatar.png',
      };

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );
      mockUserRepository.getById.mockResolvedValue(Result.ok(mockUser));
      mockUserRepository.update.mockResolvedValue(Result.ok(null));
      mockUserMapper.domainToDto.mockReturnValue(mockUserDto);

      const result = await useCase.execute(contract);

      expect(result.success).toBe(true);
      expect(mockUser.name.value).toBe(contract.name);
      expect(mockUser.avatarUrl?.value).toBe(contract.avatarUrl);
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);
    });

    it('clears the avatar url when it is explicitly null', async () => {
      const mockUser = buildUser();
      mockUser.edit({ avatarUrl: 'https://example.com/avatar.png' });
      const contract: EditUserApiRequest = { avatarUrl: null };

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );
      mockUserRepository.getById.mockResolvedValue(Result.ok(mockUser));
      mockUserRepository.update.mockResolvedValue(Result.ok(null));
      mockUserMapper.domainToDto.mockReturnValue(mockUserDto);

      const result = await useCase.execute(contract);

      expect(result.success).toBe(true);
      expect(mockUser.avatarUrl).toBeNull();
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);
    });

    it('leaves the user unchanged when no fields are present', async () => {
      const mockUser = buildUser({ name: 'Original Name' });

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );
      mockUserRepository.getById.mockResolvedValue(Result.ok(mockUser));
      mockUserRepository.update.mockResolvedValue(Result.ok(null));
      mockUserMapper.domainToDto.mockReturnValue(mockUserDto);

      const result = await useCase.execute({});

      expect(result.success).toBe(true);
      expect(mockUser.name.value).toBe('Original Name');
      expect(mockUser.avatarUrl).toBeNull();
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);
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

    it('should fail as validation when the name is invalid', async () => {
      const mockUser = buildUser();
      const invalidContract: EditUserApiRequest = { name: '' };

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

    it('should fail as validation when the avatar url is invalid', async () => {
      const mockUser = buildUser();
      const invalidContract: EditUserApiRequest = { avatarUrl: 'not-a-url' };

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );

      mockUserRepository.getById.mockResolvedValue(Result.ok(mockUser));

      const result = await useCase.execute(invalidContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('validation');
      }

      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should fail as unexpected when persistence fails', async () => {
      const mockUser = buildUser();

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
