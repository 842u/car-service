import type { Route } from 'next';
import type { ZodType } from 'zod';

import {
  type AddCarApiRequest,
  addCarApiResponseSchema,
} from '@/car/interface/api/add.schema';
import {
  type EditCarApiRequest,
  editCarApiResponseSchema,
} from '@/car/interface/api/edit.schema';
import type { CarApiClient } from '@/car/presentation/api-client/car';
import type { HttpClient } from '@/common/application/http-client';
import { Result } from '@/common/application/result';
import type { Validator } from '@/common/application/validator';

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string } };

export class NextCarApiClient implements CarApiClient {
  private readonly _httpClient: HttpClient;
  private readonly _validator: Validator;

  constructor(httpClient: HttpClient, validator: Validator) {
    this._httpClient = httpClient;
    this._validator = validator;
  }

  private async makeRequest<T>(
    endpoint: Route,
    contract: unknown,
    schema: ZodType<ApiResponse<T>>,
    method: 'POST' | 'PATCH' = 'POST',
  ): Promise<Result<T, { message: string }>> {
    const data = JSON.stringify(contract);

    const httpResult =
      method === 'POST'
        ? await this._httpClient.post(endpoint, data)
        : await this._httpClient.patch(endpoint, data);

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

  async add(contract: AddCarApiRequest) {
    return this.makeRequest('/api/car', contract, addCarApiResponseSchema);
  }

  async edit(contract: EditCarApiRequest) {
    return this.makeRequest(
      '/api/car',
      contract,
      editCarApiResponseSchema,
      'PATCH',
    );
  }
}
