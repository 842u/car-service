import type { Route } from 'next';

import {
  type AddOwnerApiRequest,
  addOwnerApiResponseSchema,
} from '@/car/ownership/interface/api/add.schema';
import {
  type PromotePrimaryOwnerApiRequest,
  promotePrimaryOwnerApiResponseSchema,
} from '@/car/ownership/interface/api/promote.schema';
import {
  type RemoveOwnerApiRequest,
  removeOwnerApiResponseSchema,
} from '@/car/ownership/interface/api/remove.schema';
import type { OwnershipApiClient } from '@/car/ownership/presentation/api-client/ownership';
import type { ApiRequester } from '@/common/application/api-requester';

const ENDPOINT: Route = '/api/car/ownership';

export class NextOwnershipApiClient implements OwnershipApiClient {
  private readonly _apiRequester: ApiRequester;

  constructor(apiRequester: ApiRequester) {
    this._apiRequester = apiRequester;
  }

  async add(contract: AddOwnerApiRequest) {
    return this._apiRequester.send(
      'POST',
      ENDPOINT,
      contract,
      addOwnerApiResponseSchema,
    );
  }

  async remove(contract: RemoveOwnerApiRequest) {
    return this._apiRequester.send(
      'DELETE',
      ENDPOINT,
      contract,
      removeOwnerApiResponseSchema,
    );
  }

  async promote(contract: PromotePrimaryOwnerApiRequest) {
    return this._apiRequester.send(
      'PATCH',
      ENDPOINT,
      contract,
      promotePrimaryOwnerApiResponseSchema,
    );
  }
}
