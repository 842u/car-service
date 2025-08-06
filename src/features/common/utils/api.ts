import { NextResponse } from 'next/server';

import type { ApiError, ApiResponse } from '../types/api';

export function errorApiResponse<E extends ApiError>(error: E, status: number) {
  return NextResponse.json<ApiResponse>(
    {
      data: undefined,
      error,
    },
    { status },
  );
}

export function successApiResponse<T>(data: T, status: number) {
  return NextResponse.json<ApiResponse>(
    {
      data,
      error: undefined,
    },
    { status },
  );
}
