import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import type { ServiceLogMapper } from '@/car/service-log/application/mapper/service-log';
import type { CarOwnershipReader } from '@/car/service-log/application/reader/car-ownership';
import type { ServiceLogRepository } from '@/car/service-log/application/repository/service-log';
import { EditServiceLogUseCase } from '@/car/service-log/application/use-case/edit-service-log';
import type { EditServiceLogApiRequest } from '@/car/service-log/interface/api/edit.schema';
import type { AuthClient } from '@/common/application/auth-client';
import { Result } from '@/common/application/result';
import { createMockAuthIdentity } from '@/lib/jest/mock/@supabase/auth';
import { createMockAuthClient } from '@/lib/jest/mock/src/common/application/auth-client';
import { createMockCarOwnership } from '@/lib/jest/mock/src/module/car/ownership/domain/ownership/car-ownership';
import { createMockServiceLogMapper } from '@/lib/jest/mock/src/module/car/service-log/application/mapper/service-log';
import { createMockCarOwnershipReader } from '@/lib/jest/mock/src/module/car/service-log/application/reader/car-ownership';
import { createMockServiceLogRepository } from '@/lib/jest/mock/src/module/car/service-log/application/repository/service-log';
import { createMockServiceLog } from '@/lib/jest/mock/src/module/car/service-log/domain/service-log';

const PRIMARY_OWNER_ID = 'b5b55395-e32f-4376-be03-f66be0a63ec4';
const AUTHOR_ID = '5202140b-aa28-4058-9191-e4a117e15353';
const NON_AUTHOR_CO_OWNER_ID = '9c3f6f8a-1e2b-4c3d-9f4e-5a6b7c8d9e0f';
const NON_OWNER_ID = '2f6c8f2e-3b1a-4f6d-8b2e-1a2b3c4d5e6f';
const CAR_ID = '6a6e49f5-9711-4a95-9fc2-3e14d0b5a4e6';
const SERVICE_LOG_ID = '11111111-1111-4111-8111-111111111111';

describe('EditServiceLogUseCase', () => {
  let useCase: EditServiceLogUseCase;
  let mockAuthClient: jest.Mocked<AuthClient>;
  let mockCarOwnershipReader: jest.Mocked<CarOwnershipReader>;
  let mockServiceLogRepository: jest.Mocked<ServiceLogRepository>;
  let mockServiceLogMapper: jest.Mocked<ServiceLogMapper>;

  beforeEach(() => {
    mockAuthClient = createMockAuthClient();
    mockCarOwnershipReader = createMockCarOwnershipReader();
    mockServiceLogRepository = createMockServiceLogRepository();
    mockServiceLogMapper = createMockServiceLogMapper();
    useCase = new EditServiceLogUseCase(
      mockAuthClient,
      mockCarOwnershipReader,
      mockServiceLogRepository,
      mockServiceLogMapper,
    );
  });

  describe('execute', () => {
    const validContract: EditServiceLogApiRequest = {
      serviceLogId: SERVICE_LOG_ID,
      serviceDate: '2026-02-01',
      categories: ['brakes'],
      mileage: 55000,
      notes: 'Replaced pads',
      serviceCost: 150,
    };

    const mockServiceLogDto: ServiceLogDto = {
      id: SERVICE_LOG_ID,
      carId: CAR_ID,
      authorId: AUTHOR_ID,
      serviceDate: '2026-02-01',
      categories: ['brakes'],
      mileage: 55000,
      notes: 'Replaced pads',
      serviceCost: 150,
      createdAt: null,
    };

    function buildServiceLog(authorId = AUTHOR_ID) {
      return createMockServiceLog({
        id: SERVICE_LOG_ID,
        carId: CAR_ID,
        authorId,
      });
    }

    function buildCarOwnership() {
      return createMockCarOwnership({
        carId: CAR_ID,
        primaryOwnerId: PRIMARY_OWNER_ID,
        coOwnerIds: [AUTHOR_ID, NON_AUTHOR_CO_OWNER_ID],
      });
    }

    it('edits the service log when the actor is the author', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(createMockAuthIdentity({ id: AUTHOR_ID })),
      );
      mockServiceLogRepository.getById.mockResolvedValue(
        Result.ok(buildServiceLog()),
      );
      mockServiceLogRepository.update.mockResolvedValue(Result.ok(null));
      mockServiceLogMapper.domainToDto.mockReturnValue(mockServiceLogDto);

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(mockServiceLogDto);
      }
      expect(mockServiceLogRepository.update).toHaveBeenCalledTimes(1);
    });

    it('performs a single, ownership-free query for a self-edit', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(createMockAuthIdentity({ id: AUTHOR_ID })),
      );
      mockServiceLogRepository.getById.mockResolvedValue(
        Result.ok(buildServiceLog()),
      );
      mockServiceLogRepository.update.mockResolvedValue(Result.ok(null));
      mockServiceLogMapper.domainToDto.mockReturnValue(mockServiceLogDto);

      await useCase.execute(validContract);

      expect(mockCarOwnershipReader.getByCarId).not.toHaveBeenCalled();
    });

    it('edits the service log when the actor is the primary owner, not the author', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(createMockAuthIdentity({ id: PRIMARY_OWNER_ID })),
      );
      mockServiceLogRepository.getById.mockResolvedValue(
        Result.ok(buildServiceLog()),
      );
      mockCarOwnershipReader.getByCarId.mockResolvedValue(
        Result.ok(buildCarOwnership()),
      );
      mockServiceLogRepository.update.mockResolvedValue(Result.ok(null));
      mockServiceLogMapper.domainToDto.mockReturnValue(mockServiceLogDto);

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(true);
      expect(mockCarOwnershipReader.getByCarId).toHaveBeenCalledWith(CAR_ID);
      expect(mockServiceLogRepository.update).toHaveBeenCalledTimes(1);
    });

    it('fails as unauthorized when a co-owner who did not author it edits it', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(createMockAuthIdentity({ id: NON_AUTHOR_CO_OWNER_ID })),
      );
      mockServiceLogRepository.getById.mockResolvedValue(
        Result.ok(buildServiceLog()),
      );
      mockCarOwnershipReader.getByCarId.mockResolvedValue(
        Result.ok(buildCarOwnership()),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('unauthorized');
      }
      expect(mockServiceLogRepository.update).not.toHaveBeenCalled();
    });

    it('fails as unauthorized when a non-owner edits it', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(createMockAuthIdentity({ id: NON_OWNER_ID })),
      );
      mockServiceLogRepository.getById.mockResolvedValue(
        Result.ok(buildServiceLog()),
      );
      mockCarOwnershipReader.getByCarId.mockResolvedValue(
        Result.ok(buildCarOwnership()),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('unauthorized');
      }
      expect(mockServiceLogRepository.update).not.toHaveBeenCalled();
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
      expect(mockServiceLogRepository.getById).not.toHaveBeenCalled();
    });

    it('fails as not-found when the service log does not exist', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(createMockAuthIdentity({ id: AUTHOR_ID })),
      );
      mockServiceLogRepository.getById.mockResolvedValue(
        Result.fail({ message: 'Service log not found' }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('not-found');
      }
      expect(mockServiceLogRepository.update).not.toHaveBeenCalled();
    });

    it('fails as not-found when the car ownership cannot be read', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(createMockAuthIdentity({ id: PRIMARY_OWNER_ID })),
      );
      mockServiceLogRepository.getById.mockResolvedValue(
        Result.ok(buildServiceLog()),
      );
      mockCarOwnershipReader.getByCarId.mockResolvedValue(
        Result.fail({ message: 'Ownership not found' }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('not-found');
      }
      expect(mockServiceLogRepository.update).not.toHaveBeenCalled();
    });

    it('fails as validation when a field is invalid', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(createMockAuthIdentity({ id: AUTHOR_ID })),
      );
      mockServiceLogRepository.getById.mockResolvedValue(
        Result.ok(buildServiceLog()),
      );

      const invalidContract: EditServiceLogApiRequest = {
        ...validContract,
        categories: [],
      };

      const result = await useCase.execute(invalidContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('validation');
      }
      expect(mockServiceLogRepository.update).not.toHaveBeenCalled();
    });

    it('fails as unexpected when the update fails', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(createMockAuthIdentity({ id: AUTHOR_ID })),
      );
      mockServiceLogRepository.getById.mockResolvedValue(
        Result.ok(buildServiceLog()),
      );
      mockServiceLogRepository.update.mockResolvedValue(
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
