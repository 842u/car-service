import type { Route } from 'next';
import type { ZodType } from 'zod';

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
import type { HttpClient } from '@/common/application/http-client';
import { Result } from '@/common/application/result';
import type { Validator } from '@/common/application/validator';
import type { ApiResponseBody } from '@/common/interface/api/response';

const ENDPOINT: Route = '/api/car/service-log';

export class NextServiceLogApiClient implements ServiceLogApiClient {
  private readonly _httpClient: HttpClient;
  private readonly _validator: Validator;

  constructor(httpClient: HttpClient, validator: Validator) {
    this._httpClient = httpClient;
    this._validator = validator;
  }

  private async makeRequest<T>(
    contract: unknown,
    schema: ZodType<ApiResponseBody<T>>,
    method: 'POST' | 'PATCH' | 'DELETE',
  ): Promise<Result<T, { message: string }>> {
    const data = JSON.stringify(contract);

    const httpResult =
      method === 'POST'
        ? await this._httpClient.post(ENDPOINT, data)
        : method === 'PATCH'
          ? await this._httpClient.patch(ENDPOINT, data)
          : await this._httpClient.delete(ENDPOINT, data);

    if (!httpResult.success) {
      return Result.fail({
        message: `HTTP request failed: ${httpResult.error.message}`,
      });
    }

    const validationResult = this._validator.validate(httpResult.data, schema);

    if (!validationResult.success) {
      return Result.fail({
        message: `API response validation failed: ${validationResult.error.message}`,
      });
    }

    const apiResponse = validationResult.data;

    if (!apiResponse.success) {
      return Result.fail({ message: apiResponse.error.message });
    }

    return Result.ok(apiResponse.data);
  }

  async add(contract: AddServiceLogApiRequest) {
    return this.makeRequest(contract, addServiceLogApiResponseSchema, 'POST');
  }

  async edit(contract: EditServiceLogApiRequest) {
    return this.makeRequest(contract, editServiceLogApiResponseSchema, 'PATCH');
  }

  async remove(serviceLogId: string) {
    const contract: RemoveServiceLogApiRequest = { serviceLogId };
    return this.makeRequest(
      contract,
      removeServiceLogApiResponseSchema,
      'DELETE',
    );
  }
}
