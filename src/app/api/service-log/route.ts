import type { NextRequest } from 'next/server';
import { ZodError } from 'zod';

import type { CarServiceLogFormValues } from '@/schemas/zod/carServiceLogFormSchema';
import { carServiceLogFormSchema } from '@/schemas/zod/carServiceLogFormSchema';
import { dataResponse, errorResponse } from '@/utils/next/routeHandlers';
import { createClient } from '@/utils/supabase/server';

export type ServiceLogPostRouteHandlerRequest = {
  formData: CarServiceLogFormValues;
  car_id: string;
};

export type ServiceLogPatchRouteHandlerRequest = {
  formData: CarServiceLogFormValues;
  service_log_id: string;
};

export type ServiceLogRouteHandlerResponse = {
  id: string;
};

export const maxDuration = 10;

export async function POST(request: NextRequest) {
  if (request.headers.get('content-type') !== 'application/json') {
    return errorResponse(
      "Invalid content type. Expected 'application/json'.",
      415,
    );
  }

  let formData: CarServiceLogFormValues | undefined;
  let car_id: string | undefined;

  try {
    ({ formData, car_id } =
      (await request.json()) as Partial<ServiceLogPostRouteHandlerRequest>);
  } catch (_) {
    return errorResponse('Invalid JSON.', 400);
  }

  if (!formData) {
    return errorResponse('Missing form data in request body.', 400);
  }

  if (!car_id) {
    return errorResponse("Missing 'car_id' in request body.", 400);
  }

  try {
    carServiceLogFormSchema.parse(formData);
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse(
        `Validation error: ${error.issues.map((issueError) => `${issueError.message}\n`)}`,
        400,
      );
    }

    if (error instanceof Error) {
      return errorResponse(`Validation error: ${error.message}.`, 400);
    }

    return errorResponse('Validation error: Unknown error occurred.', 400);
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    return errorResponse('Failed to retrieve authenticated user.', 502);
  }

  const { data: serviceLogData, error: serviceLogError } = await supabase
    .from('service_logs')
    .insert({
      ...formData,
      created_by: userData.user.id,
      car_id,
    })
    .select('id')
    .single();

  if (serviceLogError) {
    return errorResponse('Failed to insert service log entry.', 502);
  }

  return dataResponse<ServiceLogRouteHandlerResponse>(
    { id: serviceLogData.id },
    201,
  );
}

export async function PATCH(request: NextRequest) {
  if (request.headers.get('content-type') !== 'application/json') {
    return errorResponse(
      "Invalid content type. Expected 'application/json'.",
      415,
    );
  }

  let formData: CarServiceLogFormValues | undefined;
  let service_log_id: string | undefined;

  try {
    ({ formData, service_log_id } =
      (await request.json()) as Partial<ServiceLogPatchRouteHandlerRequest>);
  } catch (_) {
    return errorResponse('Invalid JSON.', 400);
  }

  if (!formData) {
    return errorResponse('Missing form data in request body.', 400);
  }

  if (!service_log_id) {
    return errorResponse("Missing 'service_log_id' in request body.", 400);
  }

  try {
    carServiceLogFormSchema.parse(formData);
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse(
        `Validation error: ${error.issues.map((issueError) => `${issueError.message}\n`)}`,
        400,
      );
    }

    if (error instanceof Error) {
      return errorResponse(`Validation error: ${error.message}.`, 400);
    }

    return errorResponse('Validation error: Unknown error occurred.', 400);
  }

  const supabase = await createClient();

  const { data: serviceLogData, error: serviceLogError } = await supabase
    .from('service_logs')
    .update({ ...formData })
    .eq('id', service_log_id)
    .select('id')
    .single();

  if (serviceLogError) {
    return errorResponse('Failed to update service log entry.', 502);
  }

  return dataResponse<ServiceLogRouteHandlerResponse>(
    { id: serviceLogData.id },
    200,
  );
}
