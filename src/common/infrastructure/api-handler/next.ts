import type { NextURL } from 'next/dist/server/web/next-url';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { ApiHandler } from '@/common/application/api-handler';
import type {
  ApiResponseError,
  ApiResponseFailureResult,
  ApiResponseMeta,
  ApiResponseSuccessResult,
} from '@/common/application/api-response';
import { Result } from '@/common/application/result';
import type { Validator } from '@/common/application/validator';

export class NextApiHandler<
  TData,
  TError extends ApiResponseError,
  TSchema,
> implements ApiHandler<TData, TError, TSchema> {
  private readonly _validator: Validator;

  constructor(validator: Validator) {
    this._validator = validator;
  }

  async preprocessRequest(
    request: NextRequest,
    schema: { _output: TSchema },
    errorMessage = 'Contract validation failed.',
  ): Promise<Result<TSchema, ApiResponseError, ApiResponseMeta>> {
    if (request.headers.get('Content-Type') !== 'application/json')
      return Result.fail(
        {
          message: "Invalid content type. Expected 'application/json'.",
        },
        { status: 415 },
      );

    let body: unknown;

    try {
      body = await request.json();
    } catch (_) {
      return Result.fail({ message: 'Invalid JSON format.' }, { status: 400 });
    }

    const validationResult = this._validator.validate(
      body,
      schema,
      errorMessage,
    );

    if (!validationResult.success) {
      const {
        error: { message, issues },
      } = validationResult;

      return Result.fail({ message, issues }, { status: 422 });
    }

    const { data } = validationResult;

    return Result.ok(data);
  }

  errorResponse(error: TError, status: number) {
    const responseResult: ApiResponseFailureResult<TError> = {
      success: false,
      error,
      status,
    };

    return NextResponse.json(responseResult, {
      status,
    });
  }

  successResponse(data: TData, status: number) {
    const responseResult: ApiResponseSuccessResult<TData> = {
      success: true,
      data,
      status,
    };

    return NextResponse.json(responseResult, { status });
  }

  redirectResponse(url: string | NextURL | URL, status: number) {
    return NextResponse.redirect(url, { status });
  }
}
