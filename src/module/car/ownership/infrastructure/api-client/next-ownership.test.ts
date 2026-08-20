import { addOwnerApiResponseSchema } from '@/car/ownership/interface/api/add.schema';
import { promotePrimaryOwnerApiResponseSchema } from '@/car/ownership/interface/api/promote.schema';
import { removeOwnerApiResponseSchema } from '@/car/ownership/interface/api/remove.schema';
import type { ApiRequester } from '@/common/application/api-requester';
import { createMockApiRequester } from '@/common/application/api-requester.mock';

import { NextOwnershipApiClient } from './next-ownership';

describe('NextOwnershipApiClient', () => {
  const contract = { carId: 'car-1', ownerId: 'owner-1' };

  let mockApiRequester: jest.Mocked<ApiRequester>;
  let ownershipApiClient: NextOwnershipApiClient;

  beforeEach(() => {
    mockApiRequester = createMockApiRequester();
    ownershipApiClient = new NextOwnershipApiClient(mockApiRequester);
  });

  it('should send add as a POST to the ownership endpoint', async () => {
    await ownershipApiClient.add(contract);

    expect(mockApiRequester.send).toHaveBeenCalledWith(
      'POST',
      '/api/car/ownership',
      contract,
      addOwnerApiResponseSchema,
    );
  });

  it('should send remove as a DELETE to the ownership endpoint', async () => {
    await ownershipApiClient.remove(contract);

    expect(mockApiRequester.send).toHaveBeenCalledWith(
      'DELETE',
      '/api/car/ownership',
      contract,
      removeOwnerApiResponseSchema,
    );
  });

  it('should send promote as a PATCH to the ownership endpoint', async () => {
    await ownershipApiClient.promote(contract);

    expect(mockApiRequester.send).toHaveBeenCalledWith(
      'PATCH',
      '/api/car/ownership',
      contract,
      promotePrimaryOwnerApiResponseSchema,
    );
  });
});
