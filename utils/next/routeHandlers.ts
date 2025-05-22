import { NextResponse } from 'next/server';

import { RouteHandlerResponse } from '@/types';

export function errorResponse(errorMessage: string, status: number) {
  return NextResponse.json<RouteHandlerResponse>(
    {
      error: {
        message: errorMessage,
      },
      data: null,
    },
    { status },
  );
}

export function dataResponse<T>(responseData: T, status: number) {
  return NextResponse.json<RouteHandlerResponse<T>>(
    {
      data: responseData,
      error: null,
    },
    { status },
  );
}
