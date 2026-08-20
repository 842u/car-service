import { addCarApiResponseSchema } from '@/car/interface/api/add.schema';
import { editCarApiResponseSchema } from '@/car/interface/api/edit.schema';
import { removeCarApiResponseSchema } from '@/car/interface/api/remove.schema';
import type { ApiRequester } from '@/common/application/api-requester';
import { createMockApiRequester } from '@/common/application/api-requester.mock';

import { NextCarApiClient } from './next-car';

describe('NextCarApiClient', () => {
  let mockApiRequester: jest.Mocked<ApiRequester>;
  let carApiClient: NextCarApiClient;

  beforeEach(() => {
    mockApiRequester = createMockApiRequester();
    carApiClient = new NextCarApiClient(mockApiRequester);
  });

  it('should send add as a POST to the car endpoint', async () => {
    const contract = { customName: 'Daily' };

    await carApiClient.add(contract);

    expect(mockApiRequester.send).toHaveBeenCalledWith(
      'POST',
      '/api/car',
      contract,
      addCarApiResponseSchema,
    );
  });

  it('should send edit as a PATCH to the car endpoint', async () => {
    const contract = { carId: 'car-1', customName: 'Weekend' };

    await carApiClient.edit(contract);

    expect(mockApiRequester.send).toHaveBeenCalledWith(
      'PATCH',
      '/api/car',
      contract,
      editCarApiResponseSchema,
    );
  });

  it('should send remove as a DELETE carrying the car id', async () => {
    await carApiClient.remove('car-1');

    expect(mockApiRequester.send).toHaveBeenCalledWith(
      'DELETE',
      '/api/car',
      { carId: 'car-1' },
      removeCarApiResponseSchema,
    );
  });
});
