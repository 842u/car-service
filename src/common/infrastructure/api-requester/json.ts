import type {
  ApiRequester,
  ApiRequesterMethod,
} from '@/common/application/api-requester';
import type {
  ApiResponseBody,
  ApiResponseError,
} from '@/common/application/api-response';
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
  ): Promise<Result<TData, ApiResponseError>> {
    const httpResult = await this._httpClient.request(
      method,
      endpoint,
      JSON.stringify(contract),
      { headers: JSON_HEADERS },
    );

    // Every message the client produces already reads as a finished sentence,
    // and these reach the user as a toast, so the message is forwarded rather
    // than prefixed with a diagnostic. The `kind` and `cause` beside it are
    // dropped rather than passed through, because the port does not declare
    // them and nothing downstream reads them.
    if (!httpResult.success) {
      return Result.fail({ message: httpResult.error.message });
    }

    const validationResult = this._validator.validate(httpResult.data, schema);

    if (!validationResult.success) {
      // The status is named because a body that is not an envelope did not
      // come from a route handler at all. A framework 404 for a mistyped path
      // reads as a 404 rather than as a schema failure.
      return Result.fail({
        message: `The server returned an unexpected response (status ${httpResult.status}).`,
      });
    }

    const responseBody = validationResult.data;

    if (!responseBody.success) return Result.fail(responseBody.error);

    return Result.ok(responseBody.data);
  }
}
