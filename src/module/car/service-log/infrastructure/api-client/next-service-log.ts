import type { Route } from 'next';

import {
  type AddServiceLogApiRequest,
  addServiceLogApiResponseSchema,
} from '@/car/service-log/interface/api/add.schema';
import {
  type EditServiceLogApiRequest,
  editServiceLogApiResponseSchema,
} from '@/car/service-log/interface/api/edit.schema';
import {
  type RemoveServiceLogApiRequest,
  removeServiceLogApiResponseSchema,
} from '@/car/service-log/interface/api/remove.schema';
import type { ServiceLogApiClient } from '@/car/service-log/presentation/api-client/service-log';
import type { ApiRequester } from '@/common/application/api-requester';

const ENDPOINT: Route = '/api/car/service-log';

export class NextServiceLogApiClient implements ServiceLogApiClient {
  private readonly _apiRequester: ApiRequester;

  constructor(apiRequester: ApiRequester) {
    this._apiRequester = apiRequester;
  }

  async add(contract: AddServiceLogApiRequest) {
    return this._apiRequester.send(
      'POST',
      ENDPOINT,
      contract,
      addServiceLogApiResponseSchema,
    );
  }

  async edit(contract: EditServiceLogApiRequest) {
    return this._apiRequester.send(
      'PATCH',
      ENDPOINT,
      contract,
      editServiceLogApiResponseSchema,
    );
  }

  async remove(serviceLogId: string) {
    const contract: RemoveServiceLogApiRequest = { serviceLogId };

    return this._apiRequester.send(
      'DELETE',
      ENDPOINT,
      contract,
      removeServiceLogApiResponseSchema,
    );
  }
}
