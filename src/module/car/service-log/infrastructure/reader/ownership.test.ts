/* eslint testing-library/no-await-sync-queries:0 */
import type { OwnershipRepository } from '@/car/ownership/application/repository/ownership';
import { createMockOwnershipRepository } from '@/car/ownership/application/repository/ownership.mock';
import { buildOwnership } from '@/car/ownership/domain/ownership/ownership.builder';
import { OwnershipReaderImplementation } from '@/car/service-log/infrastructure/reader/ownership';
import { Result } from '@/common/application/result';

const CAR_ID = '11111111-1111-4111-8111-111111111111';

describe('OwnershipReaderImplementation', () => {
  it('delegates getByCarId to the ownership repository', async () => {
    const mockOwnershipRepository: jest.Mocked<OwnershipRepository> =
      createMockOwnershipRepository();
    const mockOwnership = buildOwnership();
    mockOwnershipRepository.getByCarId.mockResolvedValue(
      Result.ok(mockOwnership),
    );

    const reader = new OwnershipReaderImplementation(mockOwnershipRepository);

    const result = await reader.getByCarId(CAR_ID);

    expect(mockOwnershipRepository.getByCarId).toHaveBeenCalledWith(CAR_ID);
    expect(result).toEqual(Result.ok(mockOwnership));
  });
});
