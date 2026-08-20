import { addServiceLogApiResponseSchema } from '@/car/service-log/interface/api/add.schema';
import { editServiceLogApiResponseSchema } from '@/car/service-log/interface/api/edit.schema';
import { removeServiceLogApiResponseSchema } from '@/car/service-log/interface/api/remove.schema';
import type { ApiRequester } from '@/common/application/api-requester';
import { createMockApiRequester } from '@/common/application/api-requester.mock';

import { NextServiceLogApiClient } from './next-service-log';

describe('NextServiceLogApiClient', () => {
  let mockApiRequester: jest.Mocked<ApiRequester>;
  let serviceLogApiClient: NextServiceLogApiClient;

  beforeEach(() => {
    mockApiRequester = createMockApiRequester();
    serviceLogApiClient = new NextServiceLogApiClient(mockApiRequester);
  });

  it('should send add as a POST to the service log endpoint', async () => {
    const contract = {
      carId: 'car-1',
      serviceDate: '2026-01-01',
      categories: ['repair'],
    };

    await serviceLogApiClient.add(contract);

    expect(mockApiRequester.send).toHaveBeenCalledWith(
      'POST',
      '/api/car/service-log',
      contract,
      addServiceLogApiResponseSchema,
    );
  });

  it('should send edit as a PATCH to the service log endpoint', async () => {
    const contract = {
      serviceLogId: 'log-1',
      serviceDate: '2026-02-01',
      categories: ['repair'],
    };

    await serviceLogApiClient.edit(contract);

    expect(mockApiRequester.send).toHaveBeenCalledWith(
      'PATCH',
      '/api/car/service-log',
      contract,
      editServiceLogApiResponseSchema,
    );
  });

  it('should send remove as a DELETE carrying the service log id', async () => {
    await serviceLogApiClient.remove('log-1');

    expect(mockApiRequester.send).toHaveBeenCalledWith(
      'DELETE',
      '/api/car/service-log',
      { serviceLogId: 'log-1' },
      removeServiceLogApiResponseSchema,
    );
  });
});
