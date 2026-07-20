import type { OwnershipVisibility } from '@/car/ownership/application/service/visibility';
import { createMockOwnershipVisibility } from '@/car/ownership/application/service/visibility.mock';
import { buildOwnership } from '@/car/ownership/domain/ownership/ownership.builder';
import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import type { ServiceLogMapper } from '@/car/service-log/application/mapper/service-log';
import { createMockServiceLogMapper } from '@/car/service-log/application/mapper/service-log.mock';
import type { ServiceLogRepository } from '@/car/service-log/application/repository/service-log';
import { createMockServiceLogRepository } from '@/car/service-log/application/repository/service-log.mock';
import { EditServiceLogUseCase } from '@/car/service-log/application/use-case/edit-service-log';
import type { ServiceLog } from '@/car/service-log/domain/service-log/service-log';
import { buildServiceLog } from '@/car/service-log/domain/service-log/service-log.builder';
import type { EditServiceLogApiRequest } from '@/car/service-log/interface/api/edit.schema';
import type { AuthClient } from '@/common/application/auth-client';
import { createMockAuthClient } from '@/common/application/auth-client.mock';
import { Result } from '@/common/application/result';
import { createMockAuthIdentity } from '@/test/mock/@supabase/auth';

const PRIMARY_OWNER_ID = 'b5b55395-e32f-4376-be03-f66be0a63ec4';
const AUTHOR_ID = '5202140b-aa28-4058-9191-e4a117e15353';
const NON_AUTHOR_CO_OWNER_ID = '9c3f6f8a-1e2b-4c3d-9f4e-5a6b7c8d9e0f';
const NON_OWNER_ID = '2f6c8f2e-3b1a-4f6d-8b2e-1a2b3c4d5e6f';
const CAR_ID = '6a6e49f5-9711-4a95-9fc2-3e14d0b5a4e6';
const SERVICE_LOG_ID = '11111111-1111-4111-8111-111111111111';

describe('EditServiceLogUseCase', () => {
  let useCase: EditServiceLogUseCase;
  let mockAuthClient: jest.Mocked<AuthClient>;
  let mockOwnershipVisibility: jest.Mocked<OwnershipVisibility>;
  let mockServiceLogRepository: jest.Mocked<ServiceLogRepository>;
  let mockServiceLogMapper: jest.Mocked<ServiceLogMapper>;

  beforeEach(() => {
    mockAuthClient = createMockAuthClient();
    mockOwnershipVisibility = createMockOwnershipVisibility();
    mockServiceLogRepository = createMockServiceLogRepository();
    mockServiceLogMapper = createMockServiceLogMapper();
    useCase = new EditServiceLogUseCase(
      mockAuthClient,
      mockOwnershipVisibility,
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

    let serviceLog: ServiceLog;

    // `ServiceLog.edit` mutates in place, so it is rebuilt per test to keep
    // cases order-independent.
    beforeEach(() => {
      serviceLog = buildServiceLog({
        id: SERVICE_LOG_ID,
        carId: CAR_ID,
        authorId: AUTHOR_ID,
      });
    });

    it('edits the service log when the actor is the primary owner, not the author', async () => {
      const ownership = buildOwnership({
        carId: CAR_ID,
        primaryOwnerId: PRIMARY_OWNER_ID,
        coOwnerIds: [AUTHOR_ID],
      });

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(createMockAuthIdentity({ id: PRIMARY_OWNER_ID })),
      );
      mockServiceLogRepository.getById.mockResolvedValue(Result.ok(serviceLog));
      mockOwnershipVisibility.resolve.mockResolvedValue(Result.ok(ownership));
      mockServiceLogRepository.update.mockResolvedValue(Result.ok(null));
      mockServiceLogMapper.domainToDto.mockReturnValue(mockServiceLogDto);

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(mockServiceLogDto);
      }
      expect(mockOwnershipVisibility.resolve).toHaveBeenCalledWith(
        CAR_ID,
        PRIMARY_OWNER_ID,
      );
      expect(mockServiceLogRepository.update).toHaveBeenCalledTimes(1);
    });

    it('edits the service log when the actor is the author and still owns the car', async () => {
      const ownership = buildOwnership({
        carId: CAR_ID,
        primaryOwnerId: PRIMARY_OWNER_ID,
        coOwnerIds: [AUTHOR_ID],
      });

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(createMockAuthIdentity({ id: AUTHOR_ID })),
      );
      mockServiceLogRepository.getById.mockResolvedValue(Result.ok(serviceLog));
      mockOwnershipVisibility.resolve.mockResolvedValue(Result.ok(ownership));
      mockServiceLogRepository.update.mockResolvedValue(Result.ok(null));
      mockServiceLogMapper.domainToDto.mockReturnValue(mockServiceLogDto);

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(true);
      expect(mockServiceLogRepository.update).toHaveBeenCalledTimes(1);
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
        expect(result.error.message).toBe('Service log not found.');
      }
      expect(mockOwnershipVisibility.resolve).not.toHaveBeenCalled();
      expect(mockServiceLogRepository.update).not.toHaveBeenCalled();
    });

    it('fails as not-found when a stranger who never owned any part of the car edits it', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(createMockAuthIdentity({ id: NON_OWNER_ID })),
      );
      mockServiceLogRepository.getById.mockResolvedValue(Result.ok(serviceLog));
      mockOwnershipVisibility.resolve.mockResolvedValue(
        Result.fail({ kind: 'not-found', message: 'Car not found.' }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('not-found');
        expect(result.error.message).toBe('Service log not found.');
      }
      expect(mockServiceLogRepository.update).not.toHaveBeenCalled();
    });

    it('fails as not-found when the author no longer owns any part of the car', async () => {
      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(createMockAuthIdentity({ id: AUTHOR_ID })),
      );
      mockServiceLogRepository.getById.mockResolvedValue(Result.ok(serviceLog));
      mockOwnershipVisibility.resolve.mockResolvedValue(
        Result.fail({ kind: 'not-found', message: 'Car not found.' }),
      );

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('not-found');
        expect(result.error.message).toBe('Service log not found.');
      }
      expect(mockServiceLogRepository.update).not.toHaveBeenCalled();
    });

    it('fails as forbidden when a co-owner who did not author it edits it', async () => {
      const ownership = buildOwnership({
        carId: CAR_ID,
        primaryOwnerId: PRIMARY_OWNER_ID,
        coOwnerIds: [AUTHOR_ID, NON_AUTHOR_CO_OWNER_ID],
      });

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(createMockAuthIdentity({ id: NON_AUTHOR_CO_OWNER_ID })),
      );
      mockServiceLogRepository.getById.mockResolvedValue(Result.ok(serviceLog));
      mockOwnershipVisibility.resolve.mockResolvedValue(Result.ok(ownership));

      const result = await useCase.execute(validContract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.kind).toBe('forbidden');
      }
      expect(mockServiceLogRepository.update).not.toHaveBeenCalled();
    });

    it('fails as validation when a field is invalid', async () => {
      const ownership = buildOwnership({
        carId: CAR_ID,
        primaryOwnerId: PRIMARY_OWNER_ID,
        coOwnerIds: [AUTHOR_ID],
      });

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(createMockAuthIdentity({ id: AUTHOR_ID })),
      );
      mockServiceLogRepository.getById.mockResolvedValue(Result.ok(serviceLog));
      mockOwnershipVisibility.resolve.mockResolvedValue(Result.ok(ownership));

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
      const ownership = buildOwnership({
        carId: CAR_ID,
        primaryOwnerId: PRIMARY_OWNER_ID,
        coOwnerIds: [AUTHOR_ID],
      });

      mockAuthClient.authenticate.mockResolvedValue(
        Result.ok(createMockAuthIdentity({ id: AUTHOR_ID })),
      );
      mockServiceLogRepository.getById.mockResolvedValue(Result.ok(serviceLog));
      mockOwnershipVisibility.resolve.mockResolvedValue(Result.ok(ownership));
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
