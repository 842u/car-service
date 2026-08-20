import type {
  ApiRequester,
  ApiRequesterError,
  ApiRequesterMethod,
} from '@/common/application/api-requester';
import type { ApiResponseBody } from '@/common/application/api-response';
import type { HttpClient } from '@/common/application/http-client';
import { Result } from '@/common/application/result';
import type { Validator } from '@/common/application/validator';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/**
 * Sends a JSON contract and reads the response envelope. The requester is the
 * only party that knows the body is JSON, so it owns both the serialization and
 * the content type; a generic client hardcoding the header would corrupt a
 * multipart body.
 */
export class JsonApiRequester implements ApiRequester {
  private readonly _httpClient: HttpClient;
  private readonly _validator: Validator;

  constructor(httpClient: HttpClient, validator: Validator) {
    this._httpClient = httpClient;
    this._validator = validator;
  }

  async send<TData>(
    method: ApiRequesterMethod,
    endpoint: string,
    contract: unknown,
    schema: { _output: ApiResponseBody<TData> },
  ): Promise<Result<TData, ApiRequesterError>> {
    const httpResult = await this.dispatch(
      method,
      endpoint,
      JSON.stringify(contract),
    );

    if (!httpResult.success) {
      return Result.fail({
        message: `HTTP request failed: ${httpResult.error.message}`,
      });
    }

    const validationResult = this._validator.validate(httpResult.data, schema);

    if (!validationResult.success) {
      // The status is part of the message because a body that is not an
      // envelope did not come from a route handler at all. A framework 404 for
      // a mistyped path reads as a 404 rather than as a schema failure.
      return Result.fail({
        message: `API response validation failed with status ${httpResult.status}: ${validationResult.error.message}`,
      });
    }

    const responseBody = validationResult.data;

    if (!responseBody.success) {
      return Result.fail({
        message: responseBody.error.message,
        issues: responseBody.error.issues,
      });
    }

    return Result.ok(responseBody.data);
  }

  private async dispatch(
    method: ApiRequesterMethod,
    endpoint: string,
    body: string,
  ) {
    const config = { headers: JSON_HEADERS };

    switch (method) {
      case 'POST':
        return this._httpClient.post(endpoint, body, config);
      case 'PATCH':
        return this._httpClient.patch(endpoint, body, config);
      case 'DELETE':
        return this._httpClient.delete(endpoint, body, config);
    }
  }
}
