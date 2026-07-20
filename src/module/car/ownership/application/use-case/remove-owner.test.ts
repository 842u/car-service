import type { OwnershipMapper } from '@/car/ownership/application/mapper/ownership';
import { createMockOwnershipMapper } from '@/car/ownership/application/mapper/ownership.mock';
import type { OwnershipRepository } from '@/car/ownership/application/repository/ownership';
import { createMockOwnershipRepository } from '@/car/ownership/application/repository/ownership.mock';
import type { OwnershipVisibility } from '@/car/ownership/application/service/visibility';
import { createMockOwnershipVisibility } from '@/car/ownership/application/service/visibility.mock';
import { RemoveOwnerUseCase } from '@/car/ownership/application/use-case/remove-owner';
import { buildOwnership } from '@/car/ownership/domain/ownership/ownership.builder';
import type { RemoveOwnerApiRequest } from '@/car/ownership/interface/api/remove.schema';
import type { AuthClient } from '@/common/application/auth-client';
import { createMockAuthClient } from '@/common/application/auth-client.mock';
import { Result } from '@/common/application/result';
import { createMockAuthIdentity } from '@/test/mock/@supabase/auth';

const PRIMARY_OWNER_ID = 'b5b55395-e32f-4376-be03-f66be0a63ec4';
const CO_OWNER_ID = '5202140b-aa28-4058-9191-e4a117e15353';
const OTHER_OWNER_ID = '9c3f6f8a-1e2b-4c3d-9f4e-5a6b7c8d9e0f';
const CAR_ID = '6a6e49f5-9711-4a95-9fc2-3e14d0b5a4e6';

describe('RemoveOwnerUseCase', () => {
  let useCase: RemoveOwnerUseCase;
  let mockAuthClient: jest.Mocked<AuthClient>;
  let mockOwnershipVisibility: jest.Mocked<OwnershipVisibility>;
  let mockOwnershipRepository: jest.Mocked<OwnershipRepository>;
  let mockOwnershipMapper: jest.Mocked<OwnershipMapper>;

  beforeEach(() => {
    mockAuthClient = createMockAuthClient();
    mockOwnershipVisibility = createMockOwnershipVisibility();
    mockOwnershipRepository = createMockOwnershipRepository();
    mockOwnershipMapper = createMockOwnershipMapper();
    useCase = new RemoveOwnerUseCase(
      mockAuthClient,
      mockOwnershipVisibility,
      mockOwnershipRepository,
    );
  });

  describe('execute', () => {
    const mockAuthIdentity = createMockAuthIdentity({ id: PRIMARY_OWNER_ID });

    const validContract: RemoveOwnerApiRequest = {
      carId: CAR_ID,
      ownerId: CO_OWNER_ID,
    };

    it('removes a co-owner when the actor is the primary owner', async () => {
      const ownership = buildOwnership({
        carId: CAR_ID,
        primaryOwnerId: PRIMARY_OWNER_ID,
        coOwnerIds: [CO_OWNER_ID],
      });

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );
      mockOwnershipVisibility.resolve.mockResolvedValue(Result.ok(ownership));
      mockOwnershipRepository.removeOwner.mockResolvedValue(Result.ok(null));

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }

      expect(mockOwnershipVisibility.resolve).toHaveBeenCalledWith(
        CAR_ID,
        PRIMARY_OWNER_ID,
      );
      expect(mockOwnershipRepository.removeOwner).toHaveBeenCalledWith(
        ownership,
        expect.objectContaining({ value: CO_OWNER_ID }),
      );
      expect(mockOwnershipMapper.domainToDto).not.toHaveBeenCalled();
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
      expect(mockOwnershipRepository.removeOwner).not.toHaveBeenCalled();
    });

    it('fails as forbidden when a co-owner removes a different owner', async () => {
      const ownership = buildOwnership({
        carId: CAR_ID,
        primaryOwnerId: PRIMARY_OWNER_ID,
        coOwnerIds: [CO_OWNER_ID, OTHER_OWNER_ID],
      });

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(createMockAuthIdentity({ id: CO_OWNER_ID })),
      );
      mockOwnershipVisibility.resolve.mockResolvedValue(Result.ok(ownership));

      const result = await useCase.execute({
        carId: CAR_ID,
        ownerId: OTHER_OWNER_ID,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('forbidden');
      }
      expect(mockOwnershipRepository.removeOwner).not.toHaveBeenCalled();
    });

    it('fails as validation when the target owner id is malformed', async () => {
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
        ownerId: 'not-a-uuid',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('validation');
      }
      expect(mockOwnershipRepository.removeOwner).not.toHaveBeenCalled();
    });

    it('fails as conflict when the target is not an owner', async () => {
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
        ownerId: OTHER_OWNER_ID,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('conflict');
      }
      expect(mockOwnershipRepository.removeOwner).not.toHaveBeenCalled();
    });

    it('fails as unexpected when persistence fails', async () => {
      const ownership = buildOwnership({
        carId: CAR_ID,
        primaryOwnerId: PRIMARY_OWNER_ID,
        coOwnerIds: [CO_OWNER_ID],
      });

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );
      mockOwnershipVisibility.resolve.mockResolvedValue(Result.ok(ownership));
      mockOwnershipRepository.removeOwner.mockResolvedValue(
        Result.fail({ message: 'Database error' }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('unexpected');
      }
    });
  });
});
