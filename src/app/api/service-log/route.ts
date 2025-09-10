import type { NextRequest } from 'next/server';
import { ZodError } from 'zod';

import {
  errorApiResponse,
  successApiResponse,
} from '@/common/interface/api/response.interface';
import { dependencyContainer, dependencyTokens } from '@/dependency-container';
import type { CarServiceLogFormValues } from '@/schemas/zod/carServiceLogFormSchema';
import { carServiceLogFormSchema } from '@/schemas/zod/carServiceLogFormSchema';

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
    return errorApiResponse(
      { message: "Invalid content type. Expected 'application/json'." },
      415,
    );
  }

  let formData: CarServiceLogFormValues | undefined;
  let car_id: string | undefined;

  try {
    ({ formData, car_id } =
      (await request.json()) as Partial<ServiceLogPostRouteHandlerRequest>);
  } catch (_) {
    return errorApiResponse({ message: 'Invalid JSON.' }, 400);
  }

  if (!formData) {
    return errorApiResponse(
      { message: 'Missing form data in request body.' },
      400,
    );
  }

  if (!car_id) {
    return errorApiResponse(
      { message: "Missing 'car_id' in request body." },
      400,
    );
  }

  try {
    carServiceLogFormSchema.parse(formData);
  } catch (error) {
    if (error instanceof ZodError) {
      return errorApiResponse(
        {
          message: `Validation error: ${error.issues.map((issueError) => `${issueError.message}\n`)}`,
        },
        400,
      );
    }

    if (error instanceof Error) {
      return errorApiResponse(
        { message: `Validation error: ${error.message}.` },
        400,
      );
    }

    return errorApiResponse(
      { message: 'Validation error: Unknown error occurred.' },
      400,
    );
  }

  const authClient = await dependencyContainer.resolve(
    dependencyTokens.AUTH_SERVER_CLIENT,
  );

  const sessionResult = await authClient.getSession();

  if (!sessionResult.success) {
    const { message } = sessionResult.error;
    return errorApiResponse({ message }, 401);
  }

  const { user } = sessionResult.data;

  const dbClient = await dependencyContainer.resolve(
    dependencyTokens.DATABASE_SERVER_CLIENT,
  );

  const queryResult = await dbClient.query(async (from) =>
    from('service_logs')
      .insert({
        ...formData,
        created_by: user.id,
        car_id,
      })
      .select('id')
      .single(),
  );

  if (!queryResult.success) {
    const { message } = queryResult.error;
    return errorApiResponse({ message }, 502);
  }

  const { id } = queryResult.data;

  return successApiResponse({ id }, 201);
}

export async function PATCH(request: NextRequest) {
  if (request.headers.get('content-type') !== 'application/json') {
    return errorApiResponse(
      { message: "Invalid content type. Expected 'application/json'." },
      415,
    );
  }

  let formData: CarServiceLogFormValues | undefined;
  let service_log_id: string | undefined;

  try {
    ({ formData, service_log_id } =
      (await request.json()) as Partial<ServiceLogPatchRouteHandlerRequest>);
  } catch (_) {
    return errorApiResponse({ message: 'Invalid JSON.' }, 400);
  }

  if (!formData) {
    return errorApiResponse(
      { message: 'Missing form data in request body.' },
      400,
    );
  }

  if (!service_log_id) {
    return errorApiResponse(
      { message: "Missing 'service_log_id' in request body." },
      400,
    );
  }

  try {
    carServiceLogFormSchema.parse(formData);
  } catch (error) {
    if (error instanceof ZodError) {
      return errorApiResponse(
        {
          message: `Validation error: ${error.issues.map((issueError) => `${issueError.message}\n`)}`,
        },
        400,
      );
    }

    if (error instanceof Error) {
      return errorApiResponse(
        { message: `Validation error: ${error.message}.` },
        400,
      );
    }

    return errorApiResponse(
      { message: 'Validation error: Unknown error occurred.' },
      400,
    );
  }

  const dbClient = await dependencyContainer.resolve(
    dependencyTokens.DATABASE_SERVER_CLIENT,
  );

  const queryResult = await dbClient.query(async (from) =>
    from('service_logs')
      .update({ ...formData })
      .eq('id', service_log_id)
      .select('id')
      .single(),
  );

  if (!queryResult.success) {
    const { message } = queryResult.error;
    return errorApiResponse({ message }, 502);
  }

  const { id } = queryResult.data;

  return successApiResponse({ id }, 200);
}
