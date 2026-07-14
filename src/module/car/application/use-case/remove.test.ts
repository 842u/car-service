import type { CarRepository } from '@/car/application/repository/car';
import { createMockCarRepository } from '@/car/application/repository/car.mock';
import { RemoveCarUseCase } from '@/car/application/use-case/remove';
import { buildCar } from '@/car/domain/car/car.builder';
import type { RemoveCarApiRequest } from '@/car/interface/api/remove.schema';
import type { AuthClient } from '@/common/application/auth-client';
import { createMockAuthClient } from '@/common/application/auth-client.mock';
import { Result } from '@/common/application/result';
import { createMockAuthIdentity } from '@/test/mock/@supabase/auth';

describe('RemoveCarUseCase', () => {
  let useCase: RemoveCarUseCase;
  let mockAuthClient: jest.Mocked<AuthClient>;
  let mockCarRepository: jest.Mocked<CarRepository>;

  beforeEach(() => {
    mockAuthClient = createMockAuthClient();
    mockCarRepository = createMockCarRepository();
    useCase = new RemoveCarUseCase(mockAuthClient, mockCarRepository);
  });

  describe('execute', () => {
    const mockAuthIdentity = createMockAuthIdentity();

    const validContract: RemoveCarApiRequest = {
      carId: '6a6e49f5-9711-4a95-9fc2-3e14d0b5a4e6',
    };

    it('should remove a car successfully', async () => {
      const mockCar = buildCar();

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );

      mockCarRepository.getById.mockResolvedValue(Result.ok(mockCar));

      mockCarRepository.remove.mockResolvedValue(Result.ok(null));

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }

      expect(mockAuthClient.authenticate).toHaveBeenCalledTimes(1);
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
      expect(mockCarRepository.getById).not.toHaveBeenCalled();
      expect(mockCarRepository.remove).not.toHaveBeenCalled();
    });

    it('should fail as not-found when the car cannot be retrieved', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );

      mockCarRepository.getById.mockResolvedValue(
        Result.fail({ message: 'Car not found' }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Car not found');
        expect(result.error.kind).toBe('not-found');
      }

      expect(mockAuthClient.authenticate).toHaveBeenCalledTimes(1);
      expect(mockCarRepository.getById).toHaveBeenCalledWith(
        validContract.carId,
      );
      expect(mockCarRepository.remove).not.toHaveBeenCalled();
    });

    it('should fail as unexpected when persistence fails', async () => {
      const mockCar = buildCar();

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );

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

      expect(mockAuthClient.authenticate).toHaveBeenCalledTimes(1);
      expect(mockCarRepository.getById).toHaveBeenCalledWith(
        validContract.carId,
      );
      expect(mockCarRepository.remove).toHaveBeenCalledWith(mockCar);
    });
  });
});
