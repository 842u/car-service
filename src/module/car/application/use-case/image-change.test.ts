import type { CarDto } from '@/car/application/dto/car';
import type { CarMapper } from '@/car/application/mapper/car';
import type { CarRepository } from '@/car/application/repository/car';
import { CarImageChangeUseCase } from '@/car/application/use-case/image-change';
import type { CarImageChangeApiRequest } from '@/car/interface/api/image-change.schema';
import type { AuthClient } from '@/common/application/auth-client';
import { Result } from '@/common/application/result';
import { createMockAuthIdentity } from '@/lib/jest/mock/@supabase/auth';
import { createMockAuthClient } from '@/lib/jest/mock/src/common/application/auth-client';
import { createMockCarRepository } from '@/lib/jest/mock/src/module/car/application/car-repository';
import { createMockCarMapper } from '@/lib/jest/mock/src/module/car/application/mapper/car';
import { createMockCar } from '@/lib/jest/mock/src/module/car/domain/car/car';

describe('CarImageChangeUseCase', () => {
  let useCase: CarImageChangeUseCase;
  let mockAuthClient: jest.Mocked<AuthClient>;
  let mockCarRepository: jest.Mocked<CarRepository>;
  let mockCarMapper: jest.Mocked<CarMapper>;

  beforeEach(() => {
    mockAuthClient = createMockAuthClient();
    mockCarRepository = createMockCarRepository();
    mockCarMapper = createMockCarMapper();
    useCase = new CarImageChangeUseCase(
      mockAuthClient,
      mockCarRepository,
      mockCarMapper,
    );
  });

  describe('execute', () => {
    const mockAuthIdentity = createMockAuthIdentity();

    const validContract: CarImageChangeApiRequest = {
      carId: '6a6e49f5-9711-4a95-9fc2-3e14d0b5a4e6',
      imageUrl: 'https://example.com/cars_images/car.png',
    };

    const mockCarDto: CarDto = {
      id: '6a6e49f5-9711-4a95-9fc2-3e14d0b5a4e6',
      imageUrl: 'https://example.com/cars_images/car.png',
      customName: 'My Car',
      brand: null,
      model: null,
      licensePlates: null,
      vin: null,
      fuelType: null,
      additionalFuelType: null,
      transmissionType: null,
      driveType: null,
      productionYear: null,
      engineCapacity: null,
      mileage: null,
      insuranceExpiration: null,
      technicalInspectionExpiration: null,
    };

    it('should change the image url successfully', async () => {
      const mockCar = createMockCar();

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );

      mockCarRepository.getById.mockResolvedValue(Result.ok(mockCar));

      mockCarRepository.update.mockResolvedValue(Result.ok(null));

      mockCarMapper.domainToDto.mockReturnValue(mockCarDto);

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(mockCarDto);
      }

      expect(mockAuthClient.authenticate).toHaveBeenCalledTimes(1);
      expect(mockCarRepository.getById).toHaveBeenCalledWith(
        validContract.carId,
      );
      expect(mockCar.imageUrl?.value).toBe(validContract.imageUrl);
      expect(mockCarRepository.update).toHaveBeenCalledWith(mockCar);
      expect(mockCarMapper.domainToDto).toHaveBeenCalledWith(mockCar);
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
      expect(mockCarRepository.update).not.toHaveBeenCalled();
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
      expect(mockCarRepository.update).not.toHaveBeenCalled();
    });

    it('should fail as validation when the image url is invalid', async () => {
      const mockCar = createMockCar();
      const invalidContract: CarImageChangeApiRequest = {
        carId: '6a6e49f5-9711-4a95-9fc2-3e14d0b5a4e6',
        imageUrl: 'not-a-url',
      };

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );

      mockCarRepository.getById.mockResolvedValue(Result.ok(mockCar));

      const result = await useCase.execute(invalidContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('validation');
        expect(result.error.message).toBeDefined();
      }

      expect(mockAuthClient.authenticate).toHaveBeenCalledTimes(1);
      expect(mockCarRepository.getById).toHaveBeenCalledWith(
        invalidContract.carId,
      );
      expect(mockCarRepository.update).not.toHaveBeenCalled();
    });

    it('should fail as unexpected when persistence fails', async () => {
      const mockCar = createMockCar();

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );

      mockCarRepository.getById.mockResolvedValue(Result.ok(mockCar));

      mockCarRepository.update.mockResolvedValue(
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
      expect(mockCarRepository.update).toHaveBeenCalledWith(mockCar);
    });
  });
});
