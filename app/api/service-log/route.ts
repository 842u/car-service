import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

import {
  carServiceLogAddFormSchema,
  CarServiceLogAddFormValues,
} from '@/schemas/zod/carServiceLogAddFormSchema';
import { RouteHandlerResponse } from '@/types';
import { createClient } from '@/utils/supabase/server';

export type ServiceLogPostRouteHandlerRequest = {
  formData: CarServiceLogAddFormValues;
  car_id: string;
};

export type ServiceLogRouteHandlerResponse = {
  id: string;
};

export const maxDuration = 10;

export async function POST(request: NextRequest) {
  if (request.headers.get('content-type') !== 'application/json')
    return NextResponse.json<RouteHandlerResponse>(
      {
        error: {
          message: "Invalid content type. Expected 'application/json'.",
        },
        data: null,
      },
      { status: 415 },
    );

  let formData: CarServiceLogAddFormValues | undefined;
  let car_id: string | undefined;

  try {
    ({ formData, car_id } =
      (await request.json()) as Partial<ServiceLogPostRouteHandlerRequest>);
  } catch (_) {
    return NextResponse.json<RouteHandlerResponse>(
      {
        error: {
          message: 'Invalid JSON.',
        },
        data: null,
      },
      { status: 400 },
    );
  }

  if (!formData) {
    return NextResponse.json<RouteHandlerResponse>(
      {
        error: {
          message: 'Missing form data in request body.',
        },
        data: null,
      },
      { status: 400 },
    );
  }

  if (!car_id) {
    return NextResponse.json<RouteHandlerResponse>(
      {
        error: {
          message: "Missing 'car_id' in request body.",
        },
        data: null,
      },
      { status: 400 },
    );
  }

  try {
    carServiceLogAddFormSchema.parse(formData);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json<RouteHandlerResponse>(
        {
          error: {
            message: `Validation error: ${error.issues.map((issueError) => `${issueError.message}\n`)}`,
          },
          data: null,
        },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
      return NextResponse.json<RouteHandlerResponse>(
        {
          error: {
            message: `Validation error: ${error.message}.`,
          },
          data: null,
        },
        { status: 400 },
      );
    }

    return NextResponse.json<RouteHandlerResponse>(
      {
        error: {
          message: 'Validation error: Unknown error occurred.',
        },
        data: null,
      },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    return NextResponse.json<RouteHandlerResponse>(
      {
        error: {
          message: 'Failed to retrieve authenticated user.',
        },
        data: null,
      },
      { status: 502 },
    );
  }

  const { data: serviceLogData, error: serviceLogError } = await supabase
    .from('service_logs')
    .insert({
      ...formData,
      service_date: formData.service_date.toString(),
      created_by: userData.user.id,
      car_id,
    })
    .select('id')
    .single();

  if (serviceLogError) {
    return NextResponse.json<RouteHandlerResponse>(
      {
        error: {
          message: 'Failed to insert service log entry.',
        },
        data: null,
      },
      { status: 502 },
    );
  }

  return NextResponse.json<
    RouteHandlerResponse<ServiceLogRouteHandlerResponse>
  >(
    {
      data: { id: serviceLogData.id },
      error: null,
    },
    { status: 201 },
  );
}
