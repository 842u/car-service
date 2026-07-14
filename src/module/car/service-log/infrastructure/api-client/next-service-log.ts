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

export class NextServiceLogApiClient implements ServiceLogApiClient {
  private readonly _httpClient: HttpClient;
  private readonly _validator: Validator;

  constructor(httpClient: HttpClient, validator: Validator) {
    this._httpClient = httpClient;
    this._validator = validator;
  }

  async add(contract: AddServiceLogApiRequest) {
    const data = JSON.stringify(contract);

    const httpResult = await this._httpClient.post(
      '/api/car/service-log',
      data,
    );

    if (!httpResult.success) {
      return Result.fail({
        message: `HTTP request failed: ${httpResult.error.message}`,
      });
    }

    const validationResult = this._validator.validate(
      httpResult.data,
      addServiceLogApiResponseSchema,
    );

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

  async edit(contract: EditServiceLogApiRequest) {
    const data = JSON.stringify(contract);

    const httpResult = await this._httpClient.patch(
      '/api/car/service-log',
      data,
    );

    if (!httpResult.success) {
      return Result.fail({
        message: `HTTP request failed: ${httpResult.error.message}`,
      });
    }

    const validationResult = this._validator.validate(
      httpResult.data,
      editServiceLogApiResponseSchema,
    );

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

  async remove(serviceLogId: string) {
    const contract: RemoveServiceLogApiRequest = { serviceLogId };
    const data = JSON.stringify(contract);

    const httpResult = await this._httpClient.delete(
      '/api/car/service-log',
      data,
    );

    if (!httpResult.success) {
      return Result.fail({
        message: `HTTP request failed: ${httpResult.error.message}`,
      });
    }

    const validationResult = this._validator.validate(
      httpResult.data,
      removeServiceLogApiResponseSchema,
    );

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
}
