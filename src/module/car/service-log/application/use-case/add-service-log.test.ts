import { buildCarOwnership } from '@/car/ownership/domain/ownership/car-ownership.builder';
import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import type { ServiceLogMapper } from '@/car/service-log/application/mapper/service-log';
import type { CarOwnershipReader } from '@/car/service-log/application/reader/car-ownership';
import type { ServiceLogRepository } from '@/car/service-log/application/repository/service-log';
import { AddServiceLogUseCase } from '@/car/service-log/application/use-case/add-service-log';
import type { AddServiceLogApiRequest } from '@/car/service-log/interface/api/add.schema';
import type { AuthClient } from '@/common/application/auth-client';
import { Result } from '@/common/application/result';
import { createMockAuthClient } from '@/lib/jest/mock/src/common/application/auth-client';
import { createMockServiceLogMapper } from '@/lib/jest/mock/src/module/car/service-log/application/mapper/service-log';
import { createMockCarOwnershipReader } from '@/lib/jest/mock/src/module/car/service-log/application/reader/car-ownership';
import { createMockServiceLogRepository } from '@/lib/jest/mock/src/module/car/service-log/application/repository/service-log';
import { createMockAuthIdentity } from '@/test/mock/@supabase/auth';

const PRIMARY_OWNER_ID = 'b5b55395-e32f-4376-be03-f66be0a63ec4';
const CO_OWNER_ID = '5202140b-aa28-4058-9191-e4a117e15353';
const NON_OWNER_ID = '9c3f6f8a-1e2b-4c3d-9f4e-5a6b7c8d9e0f';
const CAR_ID = '6a6e49f5-9711-4a95-9fc2-3e14d0b5a4e6';

describe('AddServiceLogUseCase', () => {
  let useCase: AddServiceLogUseCase;
  let mockAuthClient: jest.Mocked<AuthClient>;
  let mockCarOwnershipReader: jest.Mocked<CarOwnershipReader>;
  let mockServiceLogRepository: jest.Mocked<ServiceLogRepository>;
  let mockServiceLogMapper: jest.Mocked<ServiceLogMapper>;

  beforeEach(() => {
    mockAuthClient = createMockAuthClient();
    mockCarOwnershipReader = createMockCarOwnershipReader();
    mockServiceLogRepository = createMockServiceLogRepository();
    mockServiceLogMapper = createMockServiceLogMapper();
    useCase = new AddServiceLogUseCase(
      mockAuthClient,
      mockCarOwnershipReader,
      mockServiceLogRepository,
      mockServiceLogMapper,
    );
  });

  describe('execute', () => {
    const validContract: AddServiceLogApiRequest = {
      carId: CAR_ID,
      serviceDate: '2026-01-01',
      categories: ['engine'],
      mileage: 50000,
      notes: 'Oil change',
      serviceCost: 100,
    };

    const mockServiceLogDto: ServiceLogDto = {
      id: '11111111-1111-4111-8111-111111111111',
      carId: CAR_ID,
      authorId: PRIMARY_OWNER_ID,
      serviceDate: '2026-01-01',
      categories: ['engine'],
      mileage: 50000,
      notes: 'Oil change',
      serviceCost: 100,
      createdAt: null,
    };

    const carOwnership = buildCarOwnership({
      carId: CAR_ID,
      primaryOwnerId: PRIMARY_OWNER_ID,
      coOwnerIds: [CO_OWNER_ID],
    });

    it('adds a service log when the actor is an owner of the car', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(createMockAuthIdentity({ id: PRIMARY_OWNER_ID })),
      );
      mockCarOwnershipReader.getByCarId.mockResolvedValue(
        Result.ok(carOwnership),
      );
      mockServiceLogRepository.store.mockResolvedValue(Result.ok(null));
      mockServiceLogMapper.domainToDto.mockReturnValue(mockServiceLogDto);

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(mockServiceLogDto);
      }
      expect(mockServiceLogRepository.store).toHaveBeenCalledTimes(1);
    });

    it('adds a service log when the actor is a co-owner', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(createMockAuthIdentity({ id: CO_OWNER_ID })),
      );
      mockCarOwnershipReader.getByCarId.mockResolvedValue(
        Result.ok(carOwnership),
      );
      mockServiceLogRepository.store.mockResolvedValue(Result.ok(null));
      mockServiceLogMapper.domainToDto.mockReturnValue(mockServiceLogDto);

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(true);
      expect(mockServiceLogRepository.store).toHaveBeenCalledTimes(1);
    });

    it('sets created_by from the authenticated session, not the request', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(createMockAuthIdentity({ id: PRIMARY_OWNER_ID })),
      );
      mockCarOwnershipReader.getByCarId.mockResolvedValue(
        Result.ok(carOwnership),
      );
      mockServiceLogRepository.store.mockResolvedValue(Result.ok(null));
      mockServiceLogMapper.domainToDto.mockReturnValue(mockServiceLogDto);

      await useCase.execute(validContract);

      const storedServiceLog = mockServiceLogRepository.store.mock.calls[0][0];
      expect(storedServiceLog.authorId.value).toBe(PRIMARY_OWNER_ID);
    });

    it('fails as unauthorized when authentication fails', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.fail({ message: 'Unauthorized', code: '', status: 401 }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('unauthorized');
      }
      expect(mockCarOwnershipReader.getByCarId).not.toHaveBeenCalled();
    });

    it('fails as unauthorized when the actor does not own the car', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(createMockAuthIdentity({ id: NON_OWNER_ID })),
      );
      mockCarOwnershipReader.getByCarId.mockResolvedValue(
        Result.ok(carOwnership),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('unauthorized');
      }
      expect(mockServiceLogRepository.store).not.toHaveBeenCalled();
    });

    it('fails as not-found when the car ownership cannot be read', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(createMockAuthIdentity({ id: PRIMARY_OWNER_ID })),
      );
      mockCarOwnershipReader.getByCarId.mockResolvedValue(
        Result.fail({ message: 'Ownership not found' }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('not-found');
      }
      expect(mockServiceLogRepository.store).not.toHaveBeenCalled();
    });

    it('fails as validation when a field is invalid', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(createMockAuthIdentity({ id: PRIMARY_OWNER_ID })),
      );
      mockCarOwnershipReader.getByCarId.mockResolvedValue(
        Result.ok(carOwnership),
      );

      const invalidContract: AddServiceLogApiRequest = {
        ...validContract,
        categories: [],
      };

      const result = await useCase.execute(invalidContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('validation');
      }
      expect(mockServiceLogRepository.store).not.toHaveBeenCalled();
    });

    it('fails as unexpected when the store fails', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(createMockAuthIdentity({ id: PRIMARY_OWNER_ID })),
      );
      mockCarOwnershipReader.getByCarId.mockResolvedValue(
        Result.ok(carOwnership),
      );
      mockServiceLogRepository.store.mockResolvedValue(
        Result.fail({ message: 'Database error' }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('unexpected');
      }
      expect(mockServiceLogMapper.domainToDto).not.toHaveBeenCalled();
    });
  });
});
