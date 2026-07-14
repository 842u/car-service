/* eslint testing-library/no-await-sync-queries:0 */
import type { OwnershipRepository } from '@/car/ownership/application/repository/ownership';
import { CarOwnershipReaderImplementation } from '@/car/service-log/infrastructure/reader/car-ownership';
import { Result } from '@/common/application/result';
import { createMockOwnershipRepository } from '@/lib/jest/mock/src/module/car/ownership/application/ownership-repository';
import { createMockCarOwnership } from '@/lib/jest/mock/src/module/car/ownership/domain/ownership/car-ownership';

const CAR_ID = '11111111-1111-4111-8111-111111111111';

describe('CarOwnershipReaderImplementation', () => {
  it('delegates getByCarId to the ownership repository', async () => {
    const mockOwnershipRepository: jest.Mocked<OwnershipRepository> =
      createMockOwnershipRepository();
    const mockCarOwnership = createMockCarOwnership();
    mockOwnershipRepository.getByCarId.mockResolvedValue(
      Result.ok(mockCarOwnership),
    );

    const reader = new CarOwnershipReaderImplementation(
      mockOwnershipRepository,
    );

    const result = await reader.getByCarId(CAR_ID);

    expect(mockOwnershipRepository.getByCarId).toHaveBeenCalledWith(CAR_ID);
    expect(result).toEqual(Result.ok(mockCarOwnership));
  });
});
