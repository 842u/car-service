import type { Route } from 'next';

import {
  type AddCarApiRequest,
  addCarApiResponseSchema,
} from '@/car/interface/api/add.schema';
import {
  type EditCarApiRequest,
  editCarApiResponseSchema,
} from '@/car/interface/api/edit.schema';
import { removeCarApiResponseSchema } from '@/car/interface/api/remove.schema';
import type { CarApiClient } from '@/car/presentation/api-client/car';
import type { ApiRequester } from '@/common/application/api-requester';

const ENDPOINT: Route = '/api/car';

export class NextCarApiClient implements CarApiClient {
  private readonly _apiRequester: ApiRequester;

  constructor(apiRequester: ApiRequester) {
    this._apiRequester = apiRequester;
  }

  async add(contract: AddCarApiRequest) {
    return this._apiRequester.send(
      'POST',
      ENDPOINT,
      contract,
      addCarApiResponseSchema,
    );
  }

  async edit(contract: EditCarApiRequest) {
    return this._apiRequester.send(
      'PATCH',
      ENDPOINT,
      contract,
      editCarApiResponseSchema,
    );
  }

  async remove(carId: string) {
    return this._apiRequester.send(
      'DELETE',
      ENDPOINT,
      { carId },
      removeCarApiResponseSchema,
    );
  }
}
