import type { CarRepository } from '@/car/application/repository/car';
import { createMockCarRepository } from '@/car/application/repository/car.mock';
import { RemoveCarUseCase } from '@/car/application/use-case/remove';
import { buildCar } from '@/car/domain/car/car.builder';
import type { RemoveCarApiRequest } from '@/car/interface/api/remove.schema';
import type { OwnershipVisibility } from '@/car/ownership/application/service/visibility';
import { createMockOwnershipVisibility } from '@/car/ownership/application/service/visibility.mock';
import { buildOwnership } from '@/car/ownership/domain/ownership/ownership.builder';
import type { AuthClient } from '@/common/application/auth-client';
import { createMockAuthClient } from '@/common/application/auth-client.mock';
import { Result } from '@/common/application/result';
import { createMockAuthIdentity } from '@/test/mock/@supabase/auth';

const PRIMARY_OWNER_ID = 'b5b55395-e32f-4376-be03-f66be0a63ec4';
const CO_OWNER_ID = '5202140b-aa28-4058-9191-e4a117e15353';
const CAR_ID = '6a6e49f5-9711-4a95-9fc2-3e14d0b5a4e6';

describe('RemoveCarUseCase', () => {
  let useCase: RemoveCarUseCase;
  let mockAuthClient: jest.Mocked<AuthClient>;
  let mockOwnershipVisibility: jest.Mocked<OwnershipVisibility>;
  let mockCarRepository: jest.Mocked<CarRepository>;

  beforeEach(() => {
    mockAuthClient = createMockAuthClient();
    mockOwnershipVisibility = createMockOwnershipVisibility();
    mockCarRepository = createMockCarRepository();
    useCase = new RemoveCarUseCase(
      mockAuthClient,
      mockOwnershipVisibility,
      mockCarRepository,
    );
  });

  describe('execute', () => {
    const mockAuthIdentity = createMockAuthIdentity({ id: PRIMARY_OWNER_ID });

    const validContract: RemoveCarApiRequest = {
      carId: CAR_ID,
    };

    it('should remove a car successfully when the actor is the primary owner', async () => {
      const ownership = buildOwnership({
        carId: CAR_ID,
        primaryOwnerId: PRIMARY_OWNER_ID,
      });
      const mockCar = buildCar();

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );
      mockOwnershipVisibility.resolve.mockResolvedValue(Result.ok(ownership));
      mockCarRepository.getById.mockResolvedValue(Result.ok(mockCar));
      mockCarRepository.remove.mockResolvedValue(Result.ok(null));

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }

      expect(mockAuthClient.authenticate).toHaveBeenCalledTimes(1);
      expect(mockOwnershipVisibility.resolve).toHaveBeenCalledWith(
        CAR_ID,
        PRIMARY_OWNER_ID,
      );
      expect(mockCarRepository.getById).toHaveBeenCalledWith(
        validContract.carId,
      );
      expect(mockCarRepository.remove).toHaveBeenCalledWith(mockCar);
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
      expect(mockOwnershipVisibility.resolve).not.toHaveBeenCalled();
      expect(mockCarRepository.getById).not.toHaveBeenCalled();
      expect(mockCarRepository.remove).not.toHaveBeenCalled();
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

      expect(mockCarRepository.getById).not.toHaveBeenCalled();
      expect(mockCarRepository.remove).not.toHaveBeenCalled();
    });

    it('fails as forbidden when the actor is a co-owner, not the primary owner', async () => {
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

      expect(mockCarRepository.getById).not.toHaveBeenCalled();
      expect(mockCarRepository.remove).not.toHaveBeenCalled();
    });

    it('should fail as unexpected when the car cannot be retrieved after authorization', async () => {
      const ownership = buildOwnership({
        carId: CAR_ID,
        primaryOwnerId: PRIMARY_OWNER_ID,
      });

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );
      mockOwnershipVisibility.resolve.mockResolvedValue(Result.ok(ownership));
      mockCarRepository.getById.mockResolvedValue(
        Result.fail({ message: 'Car not found' }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Car not found');
        expect(result.error.kind).toBe('unexpected');
      }

      expect(mockCarRepository.getById).toHaveBeenCalledWith(
        validContract.carId,
      );
      expect(mockCarRepository.remove).not.toHaveBeenCalled();
    });

    it('should fail as unexpected when persistence fails', async () => {
      const ownership = buildOwnership({
        carId: CAR_ID,
        primaryOwnerId: PRIMARY_OWNER_ID,
      });
      const mockCar = buildCar();

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );
      mockOwnershipVisibility.resolve.mockResolvedValue(Result.ok(ownership));
      mockCarRepository.getById.mockResolvedValue(Result.ok(mockCar));
      mockCarRepository.remove.mockResolvedValue(
        Result.fail({ message: 'Database error' }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Database error');
        expect(result.error.kind).toBe('unexpected');
      }

      expect(mockCarRepository.getById).toHaveBeenCalledWith(
        validContract.carId,
      );
      expect(mockCarRepository.remove).toHaveBeenCalledWith(mockCar);
    });
  });
});
