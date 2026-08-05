import type { NextURL } from 'next/dist/server/web/next-url';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type {
  ApiHandler,
  ApiHandlerResponseError,
} from '@/common/application/api-handler';
import {
  type FailureResult,
  Result,
  type SuccessResult,
} from '@/common/application/result';
import type { Validator, ValidatorIssue } from '@/common/application/validator';

type ErrorResponseResult<TError extends ApiHandlerResponseError> =
  FailureResult<TError, { status: number }>;

type SuccessResponseResult<TData> = SuccessResult<TData, { status: number }>;

export class NextApiHandler<
  TData,
  TError extends ApiHandlerResponseError,
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
  ): Promise<
    Result<
      TSchema,
      { message: string; issues?: ValidatorIssue[] },
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
    const responseResult: ErrorResponseResult<TError> = {
      success: false,
      error,
      status,
    };

    return NextResponse.json(responseResult, {
      status,
    });
  }

  successResponse(data: TData, status: number) {
    const responseResult: SuccessResponseResult<TData> = {
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
