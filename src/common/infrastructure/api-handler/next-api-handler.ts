import type { NextURL } from 'next/dist/server/web/next-url';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type {
  ApiHandler,
  ApiHandlerResponseError,
  ApiHandlerResponseMeta,
} from '@/common/application/api-handler/api-handler.interface';
import {
  type FailureResult,
  Result,
  type SuccessResult,
} from '@/common/application/result/result';
import type { ValidationIssue } from '@/common/application/validation/validator.interface';
import type { ZodValidator } from '@/common/infrastructure/validation/zod-validator';

export type ErrorResponseResult<E extends ApiHandlerResponseError> =
  FailureResult<E, ApiHandlerResponseMeta>;

export type SuccessResponseResult<T> = SuccessResult<T, ApiHandlerResponseMeta>;

export class NextApiHandler<T, E extends ApiHandlerResponseError, TBody>
  implements ApiHandler<T, E>
{
  private readonly _validator: ZodValidator<TBody>;

  constructor(validator: ZodValidator<TBody>) {
    this._validator = validator;
  }

  async preprocessRequest(
    request: NextRequest,
  ): Promise<
    Result<
      TBody,
      { message: string; issues?: ValidationIssue[] },
      { status: number }
    >
  > {
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

    const validationResult = this._validator.validate(body);

    if (!validationResult.success) {
      const {
        error: { message, issues },
      } = validationResult;

      return Result.fail({ message, issues }, { status: 400 });
    }

    const { data } = validationResult;

    return Result.ok(data);
  }

  errorResponse(error: E, status: number) {
    const responseResult: ErrorResponseResult<E> = {
      success: false,
      error,
      status,
    };

    return NextResponse.json(responseResult, {
      status,
    });
  }

  successResponse(data: T, status: number) {
    const responseResult: SuccessResponseResult<T> = {
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
