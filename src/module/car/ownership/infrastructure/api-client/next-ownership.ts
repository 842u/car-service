import type { Route } from 'next';
import type { ZodType } from 'zod';

import {
  type AddOwnerApiRequest,
  addOwnerApiResponseSchema,
} from '@/car/ownership/interface/api/add.schema';
import type { OwnershipApiClient } from '@/car/ownership/presentation/api-client/ownership';
import type {
  HttpClient,
  HttpClientResponse,
} from '@/common/application/http-client';
import { Result } from '@/common/application/result';
import type { Validator } from '@/common/application/validator';

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string } };

export class NextOwnershipApiClient implements OwnershipApiClient {
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
  ): Promise<Result<T, { message: string }>> {
    const data = JSON.stringify(contract);

    const httpResult: HttpClientResponse = await this._httpClient.post(
      endpoint,
      data,
    );

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

  async add(contract: AddOwnerApiRequest) {
    return this.makeRequest(
      '/api/car/ownership',
      contract,
      addOwnerApiResponseSchema,
    );
  }
}
