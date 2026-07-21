import type { OwnershipRepository } from '@/car/ownership/application/repository/ownership';
import { createMockOwnershipRepository } from '@/car/ownership/application/repository/ownership.mock';
import { OwnershipVisibilityService } from '@/car/ownership/application/service/visibility';
import { buildOwnership } from '@/car/ownership/domain/ownership/ownership.builder';
import { Result } from '@/common/application/result';

const PRIMARY_OWNER_ID = 'b5b55395-e32f-4376-be03-f66be0a63ec4';
const CO_OWNER_ID = '5202140b-aa28-4058-9191-e4a117e15353';
const STRANGER_ID = '9c3f6f8a-1e2b-4c3d-9f4e-5a6b7c8d9e0f';
const CAR_ID = '6a6e49f5-9711-4a95-9fc2-3e14d0b5a4e6';

describe('OwnershipVisibilityService', () => {
  let service: OwnershipVisibilityService;
  let mockOwnershipRepository: jest.Mocked<OwnershipRepository>;

  beforeEach(() => {
    mockOwnershipRepository = createMockOwnershipRepository();
    service = new OwnershipVisibilityService(mockOwnershipRepository);
  });

  describe('resolve', () => {
    it('resolves the Ownership when the actor is the primary owner', async () => {
      const ownership = buildOwnership({
        carId: CAR_ID,
        primaryOwnerId: PRIMARY_OWNER_ID,
      });

      mockOwnershipRepository.getByCarId.mockResolvedValue(
        Result.ok(ownership),
      );

      const result = await service.resolve(CAR_ID, PRIMARY_OWNER_ID);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(ownership);
      }
    });

    it('resolves the Ownership when the actor is a co-owner', async () => {
      const ownership = buildOwnership({
        carId: CAR_ID,
        primaryOwnerId: PRIMARY_OWNER_ID,
        coOwnerIds: [CO_OWNER_ID],
      });

      mockOwnershipRepository.getByCarId.mockResolvedValue(
        Result.ok(ownership),
      );

      const result = await service.resolve(CAR_ID, CO_OWNER_ID);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(ownership);
      }
    });

    it('masks a stranger as not-found', async () => {
      const ownership = buildOwnership({
        carId: CAR_ID,
        primaryOwnerId: PRIMARY_OWNER_ID,
        coOwnerIds: [CO_OWNER_ID],
      });

      mockOwnershipRepository.getByCarId.mockResolvedValue(
        Result.ok(ownership),
      );

      const result = await service.resolve(CAR_ID, STRANGER_ID);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toEqual({
          kind: 'not-found',
          message: 'Car not found.',
        });
      }
    });

    it('masks an absent Ownership identically to a stranger', async () => {
      mockOwnershipRepository.getByCarId.mockResolvedValue(Result.ok(null));

      const result = await service.resolve(CAR_ID, STRANGER_ID);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toEqual({
          kind: 'not-found',
          message: 'Car not found.',
        });
      }
    });

    it('answers unexpected, not masked, when the repository read fails', async () => {
      mockOwnershipRepository.getByCarId.mockResolvedValue(
        Result.fail({ message: 'Connection to database lost.' }),
      );

      const result = await service.resolve(CAR_ID, STRANGER_ID);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toEqual({
          kind: 'unexpected',
          message: 'Connection to database lost.',
        });
      }
    });

    it('answers unexpected for a broken read even for the primary owner', async () => {
      mockOwnershipRepository.getByCarId.mockResolvedValue(
        Result.fail({ message: 'Connection to database lost.' }),
      );

      const result = await service.resolve(CAR_ID, PRIMARY_OWNER_ID);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('unexpected');
      }
    });
  });
});
