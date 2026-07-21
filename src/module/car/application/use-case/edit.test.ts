import type { CarDto } from '@/car/application/dto/car';
import type { CarMapper } from '@/car/application/mapper/car';
import { createMockCarMapper } from '@/car/application/mapper/car.mock';
import type { CarRepository } from '@/car/application/repository/car';
import { createMockCarRepository } from '@/car/application/repository/car.mock';
import { EditCarUseCase } from '@/car/application/use-case/edit';
import { buildCar } from '@/car/domain/car/car.builder';
import type { EditCarApiRequest } from '@/car/interface/api/edit.schema';
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

describe('EditCarUseCase', () => {
  let useCase: EditCarUseCase;
  let mockAuthClient: jest.Mocked<AuthClient>;
  let mockOwnershipVisibility: jest.Mocked<OwnershipVisibility>;
  let mockCarRepository: jest.Mocked<CarRepository>;
  let mockCarMapper: jest.Mocked<CarMapper>;

  beforeEach(() => {
    mockAuthClient = createMockAuthClient();
    mockOwnershipVisibility = createMockOwnershipVisibility();
    mockCarRepository = createMockCarRepository();
    mockCarMapper = createMockCarMapper();
    useCase = new EditCarUseCase(
      mockAuthClient,
      mockOwnershipVisibility,
      mockCarRepository,
      mockCarMapper,
    );
  });

  describe('execute', () => {
    const mockAuthIdentity = createMockAuthIdentity({ id: PRIMARY_OWNER_ID });

    const validContract: EditCarApiRequest = {
      carId: CAR_ID,
      customName: 'Edited Car',
    };

    const mockCarDto: CarDto = {
      id: CAR_ID,
      imageUrl: null,
      customName: 'Edited Car',
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

    it('should edit a car successfully when the actor is the primary owner', async () => {
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
      mockCarRepository.update.mockResolvedValue(Result.ok(null));
      mockCarMapper.domainToDto.mockReturnValue(mockCarDto);

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(mockCarDto);
      }

      expect(mockAuthClient.authenticate).toHaveBeenCalledTimes(1);
      expect(mockOwnershipVisibility.resolve).toHaveBeenCalledWith(
        CAR_ID,
        PRIMARY_OWNER_ID,
      );
      expect(mockCarRepository.getById).toHaveBeenCalledWith(
        validContract.carId,
      );
      expect(mockCar.customName.value).toBe(validContract.customName);
      expect(mockCarRepository.update).toHaveBeenCalledWith(mockCar);
      expect(mockCarMapper.domainToDto).toHaveBeenCalledWith(mockCar);
    });

    it('changes the image url as an ordinary field of the edit contract', async () => {
      const ownership = buildOwnership({
        carId: CAR_ID,
        primaryOwnerId: PRIMARY_OWNER_ID,
      });
      const mockCar = buildCar();
      const contract: EditCarApiRequest = {
        carId: CAR_ID,
        customName: 'Edited Car',
        imageUrl: 'https://example.com/cars_images/car.png',
      };

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );
      mockOwnershipVisibility.resolve.mockResolvedValue(Result.ok(ownership));
      mockCarRepository.getById.mockResolvedValue(Result.ok(mockCar));
      mockCarRepository.update.mockResolvedValue(Result.ok(null));
      mockCarMapper.domainToDto.mockReturnValue(mockCarDto);

      const result = await useCase.execute(contract);

      expect(result.success).toBe(true);
      expect(mockCar.imageUrl?.value).toBe(contract.imageUrl);
      expect(mockCarRepository.update).toHaveBeenCalledWith(mockCar);
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
      expect(mockCarRepository.update).not.toHaveBeenCalled();
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
      expect(mockCarRepository.update).not.toHaveBeenCalled();
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
      expect(mockCarRepository.update).not.toHaveBeenCalled();
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
      expect(mockCarRepository.update).not.toHaveBeenCalled();
    });

    it('should fail as validation when a field is invalid', async () => {
      const ownership = buildOwnership({
        carId: CAR_ID,
        primaryOwnerId: PRIMARY_OWNER_ID,
      });
      const mockCar = buildCar();
      const invalidContract: EditCarApiRequest = {
        carId: CAR_ID,
        customName: '',
      };

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );
      mockOwnershipVisibility.resolve.mockResolvedValue(Result.ok(ownership));
      mockCarRepository.getById.mockResolvedValue(Result.ok(mockCar));

      const result = await useCase.execute(invalidContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('validation');
        expect(result.error.message).toBeDefined();
      }

      expect(mockCarRepository.getById).toHaveBeenCalledWith(
        invalidContract.carId,
      );
      expect(mockCarRepository.update).not.toHaveBeenCalled();
    });

    it('should fail as validation when the image url is invalid', async () => {
      const ownership = buildOwnership({
        carId: CAR_ID,
        primaryOwnerId: PRIMARY_OWNER_ID,
      });
      const mockCar = buildCar();
      const invalidContract: EditCarApiRequest = {
        carId: CAR_ID,
        customName: 'Edited Car',
        imageUrl: 'not-a-url',
      };

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );
      mockOwnershipVisibility.resolve.mockResolvedValue(Result.ok(ownership));
      mockCarRepository.getById.mockResolvedValue(Result.ok(mockCar));

      const result = await useCase.execute(invalidContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('validation');
      }

      expect(mockCarRepository.update).not.toHaveBeenCalled();
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
      mockCarRepository.update.mockResolvedValue(
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
      expect(mockCarRepository.update).toHaveBeenCalledWith(mockCar);
    });
  });
});
