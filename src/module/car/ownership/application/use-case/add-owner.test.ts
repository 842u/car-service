import type { OwnershipDto } from '@/car/ownership/application/dto/ownership';
import { buildOwnershipDto } from '@/car/ownership/application/dto/ownership.builder';
import type { OwnershipMapper } from '@/car/ownership/application/mapper/ownership';
import { createMockOwnershipMapper } from '@/car/ownership/application/mapper/ownership.mock';
import type { OwnershipRepository } from '@/car/ownership/application/repository/ownership';
import { createMockOwnershipRepository } from '@/car/ownership/application/repository/ownership.mock';
import type { OwnershipVisibility } from '@/car/ownership/application/service/visibility';
import { createMockOwnershipVisibility } from '@/car/ownership/application/service/visibility.mock';
import { AddOwnerUseCase } from '@/car/ownership/application/use-case/add-owner';
import { buildOwnership } from '@/car/ownership/domain/ownership/ownership.builder';
import type { AddOwnerApiRequest } from '@/car/ownership/interface/api/add.schema';
import type { AuthClient } from '@/common/application/auth-client';
import { createMockAuthClient } from '@/common/application/auth-client.mock';
import { Result } from '@/common/application/result';
import { createMockAuthIdentity } from '@/test/mock/@supabase/auth';

const PRIMARY_OWNER_ID = 'b5b55395-e32f-4376-be03-f66be0a63ec4';
const CO_OWNER_ID = '5202140b-aa28-4058-9191-e4a117e15353';
const NEW_OWNER_ID = '9c3f6f8a-1e2b-4c3d-9f4e-5a6b7c8d9e0f';
const CAR_ID = '6a6e49f5-9711-4a95-9fc2-3e14d0b5a4e6';

describe('AddOwnerUseCase', () => {
  let useCase: AddOwnerUseCase;
  let mockAuthClient: jest.Mocked<AuthClient>;
  let mockOwnershipVisibility: jest.Mocked<OwnershipVisibility>;
  let mockOwnershipRepository: jest.Mocked<OwnershipRepository>;
  let mockOwnershipMapper: jest.Mocked<OwnershipMapper>;

  beforeEach(() => {
    mockAuthClient = createMockAuthClient();
    mockOwnershipVisibility = createMockOwnershipVisibility();
    mockOwnershipRepository = createMockOwnershipRepository();
    mockOwnershipMapper = createMockOwnershipMapper();
    useCase = new AddOwnerUseCase(
      mockAuthClient,
      mockOwnershipVisibility,
      mockOwnershipRepository,
      mockOwnershipMapper,
    );
  });

  describe('execute', () => {
    const mockAuthIdentity = createMockAuthIdentity({ id: PRIMARY_OWNER_ID });

    const validContract: AddOwnerApiRequest = {
      carId: CAR_ID,
      ownerId: NEW_OWNER_ID,
    };

    it('adds a co-owner when the actor is the primary owner', async () => {
      const ownership = buildOwnership({
        carId: CAR_ID,
        primaryOwnerId: PRIMARY_OWNER_ID,
      });

      const mockOwnershipDtos: OwnershipDto[] = [
        buildOwnershipDto({
          carId: CAR_ID,
          ownerId: PRIMARY_OWNER_ID,
          isPrimary: true,
        }),
        buildOwnershipDto({
          carId: CAR_ID,
          ownerId: NEW_OWNER_ID,
          isPrimary: false,
        }),
      ];

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );
      mockOwnershipVisibility.resolve.mockResolvedValue(Result.ok(ownership));
      mockOwnershipRepository.addOwner.mockResolvedValue(Result.ok(null));
      mockOwnershipMapper.domainToDto.mockReturnValue(mockOwnershipDtos);

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(mockOwnershipDtos);
      }

      expect(mockOwnershipVisibility.resolve).toHaveBeenCalledWith(
        CAR_ID,
        PRIMARY_OWNER_ID,
      );
      expect(mockOwnershipRepository.addOwner).toHaveBeenCalledWith(
        ownership,
        expect.objectContaining({ value: NEW_OWNER_ID }),
      );
      expect(mockOwnershipMapper.domainToDto).toHaveBeenCalledWith(ownership);
    });

    it('fails as unauthorized when the session is not authenticated', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.fail({ message: 'Unauthorized', code: '', status: 401 }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('unauthorized');
      }
      expect(mockOwnershipVisibility.resolve).not.toHaveBeenCalled();
    });

    it('fails as not-found when visibility resolution fails (absent or stranger, masked identically)', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );
      mockOwnershipVisibility.resolve.mockResolvedValue(
        Result.fail({ kind: 'not-found', message: 'Car not found.' }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('not-found');
      }
      expect(mockOwnershipRepository.addOwner).not.toHaveBeenCalled();
    });

    it('fails as forbidden when the actor is not the primary owner', async () => {
      const ownership = buildOwnership({
        carId: CAR_ID,
        primaryOwnerId: PRIMARY_OWNER_ID,
        coOwnerIds: [CO_OWNER_ID],
      });

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(createMockAuthIdentity({ id: CO_OWNER_ID })),
      );
      mockOwnershipVisibility.resolve.mockResolvedValue(Result.ok(ownership));

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('forbidden');
      }
      expect(mockOwnershipRepository.addOwner).not.toHaveBeenCalled();
    });

    it('fails as validation when the new owner id is malformed', async () => {
      const ownership = buildOwnership({
        carId: CAR_ID,
        primaryOwnerId: PRIMARY_OWNER_ID,
      });

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );
      mockOwnershipVisibility.resolve.mockResolvedValue(Result.ok(ownership));

      const result = await useCase.execute({
        carId: CAR_ID,
        ownerId: 'not-a-uuid',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('validation');
      }
      expect(mockOwnershipRepository.addOwner).not.toHaveBeenCalled();
    });

    it('fails as conflict when the new owner already owns the car', async () => {
      const ownership = buildOwnership({
        carId: CAR_ID,
        primaryOwnerId: PRIMARY_OWNER_ID,
        coOwnerIds: [CO_OWNER_ID],
      });

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );
      mockOwnershipVisibility.resolve.mockResolvedValue(Result.ok(ownership));

      const result = await useCase.execute({
        carId: CAR_ID,
        ownerId: CO_OWNER_ID,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('conflict');
      }
      expect(mockOwnershipRepository.addOwner).not.toHaveBeenCalled();
    });

    it('fails as unexpected when persistence fails', async () => {
      const ownership = buildOwnership({
        carId: CAR_ID,
        primaryOwnerId: PRIMARY_OWNER_ID,
      });

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );
      mockOwnershipVisibility.resolve.mockResolvedValue(Result.ok(ownership));
      mockOwnershipRepository.addOwner.mockResolvedValue(
        Result.fail({ message: 'Database error' }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('unexpected');
      }
      expect(mockOwnershipMapper.domainToDto).not.toHaveBeenCalled();
    });
  });
});
