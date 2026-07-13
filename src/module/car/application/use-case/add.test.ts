import type { CarDto } from '@/car/application/dto/car';
import type { CarMapper } from '@/car/application/mapper/car';
import type { CarProvisioning } from '@/car/application/provisioning/car';
import { AddCarUseCase } from '@/car/application/use-case/add';
import type { AddCarApiRequest } from '@/car/interface/api/add.schema';
import type { AuthClient } from '@/common/application/auth-client';
import { Result } from '@/common/application/result';
import { createMockAuthIdentity } from '@/lib/jest/mock/@supabase/auth';
import { createMockAuthClient } from '@/lib/jest/mock/src/common/application/auth-client';
import { createMockCarProvisioning } from '@/lib/jest/mock/src/module/car/application/car-provisioning';
import { createMockCarMapper } from '@/lib/jest/mock/src/module/car/application/mapper/car';

describe('AddCarUseCase', () => {
  let useCase: AddCarUseCase;
  let mockAuthClient: jest.Mocked<AuthClient>;
  let mockCarProvisioning: jest.Mocked<CarProvisioning>;
  let mockCarMapper: jest.Mocked<CarMapper>;

  beforeEach(() => {
    mockAuthClient = createMockAuthClient();
    mockCarProvisioning = createMockCarProvisioning();
    mockCarMapper = createMockCarMapper();
    useCase = new AddCarUseCase(
      mockAuthClient,
      mockCarProvisioning,
      mockCarMapper,
    );
  });

  describe('execute', () => {
    const mockAuthIdentity = createMockAuthIdentity();

    const validContract: AddCarApiRequest = {
      customName: 'My Car',
    };

    const mockCarDto: CarDto = {
      id: '6a6e49f5-9711-4a95-9fc2-3e14d0b5a4e6',
      imageUrl: null,
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

    it('should add a car successfully', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );

      mockCarProvisioning.createWithPrimaryOwner.mockResolvedValue(
        Result.ok(null),
      );

      mockCarMapper.domainToDto.mockReturnValue(mockCarDto);

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(mockCarDto);
      }

      expect(mockAuthClient.authenticate).toHaveBeenCalledTimes(1);
      expect(mockCarProvisioning.createWithPrimaryOwner).toHaveBeenCalledTimes(
        1,
      );
      expect(mockCarMapper.domainToDto).toHaveBeenCalledTimes(1);
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
      expect(mockCarProvisioning.createWithPrimaryOwner).not.toHaveBeenCalled();
    });

    it('should fail as unexpected when the session id is malformed', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(createMockAuthIdentity({ id: 'not-a-uuid' })),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('unexpected');
      }

      expect(mockCarProvisioning.createWithPrimaryOwner).not.toHaveBeenCalled();
    });

    it('should fail as validation when a field is invalid', async () => {
      const invalidContract: AddCarApiRequest = {
        customName: '',
      };

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );

      const result = await useCase.execute(invalidContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('validation');
        expect(result.error.message).toBeDefined();
      }

      expect(mockAuthClient.authenticate).toHaveBeenCalledTimes(1);
      expect(mockCarProvisioning.createWithPrimaryOwner).not.toHaveBeenCalled();
    });

    it('should fail as unexpected when provisioning fails', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(mockAuthIdentity),
      );

      mockCarProvisioning.createWithPrimaryOwner.mockResolvedValue(
        Result.fail({ message: 'Database error' }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Database error');
        expect(result.error.kind).toBe('unexpected');
      }

      expect(mockAuthClient.authenticate).toHaveBeenCalledTimes(1);
      expect(mockCarProvisioning.createWithPrimaryOwner).toHaveBeenCalledTimes(
        1,
      );
      expect(mockCarMapper.domainToDto).not.toHaveBeenCalled();
    });
  });
});
