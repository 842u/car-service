import type { NextRequest } from 'next/server';
import { ZodError } from 'zod';

import {
  errorApiResponse,
  successApiResponse,
} from '@/common/interface/api/response.interface';
import { dependencyContainer, dependencyTokens } from '@/di';
import type { CarFormValues } from '@/schemas/zod/carFormSchema';
import { carFormSchema } from '@/schemas/zod/carFormSchema';

type CarFormValuesToValidate = Omit<CarFormValues, 'image'>;

export type ApiCarResponse = { id: string };
export type ApiCarRequestBody = {
  carFormData: CarFormValuesToValidate;
  carId: string | null;
};

export const maxDuration = 10;

export async function POST(request: NextRequest) {
  if (request.headers.get('content-type') !== 'application/json')
    return errorApiResponse({ message: 'Unsupported Media Type' }, 415);

  const { carFormData } = (await request.json()) as ApiCarRequestBody;

  try {
    carFormSchema.parse(carFormData);
  } catch (error) {
    if (error instanceof ZodError) {
      return errorApiResponse(
        {
          message: `Server validation failed: ${error.issues.map((issueError) => `${issueError.message}\n`)}`,
        },
        400,
      );
    }
    if (error instanceof Error) {
      return errorApiResponse(
        { message: `Server validation failed: ${error.message}.` },
        400,
      );
    }
    return errorApiResponse(
      { message: 'Server data validation failed. Try again.' },
      400,
    );
  }

  const dbClient = await dependencyContainer.resolve(
    dependencyTokens.DATABASE_SERVER_CLIENT,
  );

  /*
   * While posting new car with image, its id is needed.
   * Due to RLS policies on "cars" table for SELECT,
   * usage of RPC is required to immediately return a new car id.
   * User to be able to select a car, must have ownership of that specific car,
   * and corresponding row in "cars_ownerships" table should exist.
   * However rows in "cars_ownerships" are created AFTER INSERT on "cars" table,
   * so RLS restricts immediate SELECT while using "supabase.from().insert().select()".
   */
  const rpcResult = await dbClient.rpc(async (rpc) =>
    rpc('create_new_car', {
      additional_fuel_type: carFormData.additional_fuel_type || undefined,
      custom_name: carFormData.custom_name || 'New car',
      brand: carFormData.brand || undefined,
      drive_type: carFormData.drive_type || undefined,
      engine_capacity: carFormData.engine_capacity || undefined,
      fuel_type: carFormData.fuel_type || undefined,
      insurance_expiration: carFormData.insurance_expiration || undefined,
      technical_inspection_expiration:
        carFormData.technical_inspection_expiration || undefined,
      license_plates: carFormData.license_plates || undefined,
      mileage: carFormData.mileage || undefined,
      model: carFormData.model || undefined,
      production_year: carFormData.production_year || undefined,
      transmission_type: carFormData.transmission_type || undefined,
      vin: carFormData.vin || undefined,
    }),
  );

  if (!rpcResult.success) {
    const { message } = rpcResult.error;
    return errorApiResponse({ message }, 502);
  }

  const { data } = rpcResult;

  return successApiResponse({ id: data }, 201);
}

export async function PATCH(request: NextRequest) {
  if (request.headers.get('content-type') !== 'application/json')
    return errorApiResponse({ message: 'Unsupported Media Type' }, 415);

  const { carFormData, carId } = (await request.json()) as ApiCarRequestBody;

  try {
    carFormSchema.parse(carFormData);
  } catch (error) {
    if (error instanceof ZodError) {
      return errorApiResponse(
        {
          message: `Server validation failed: ${error.issues.map((issueError) => `${issueError.message}\n`)}`,
        },
        400,
      );
    }
    if (error instanceof Error) {
      return errorApiResponse(
        { message: `Server validation failed: ${error.message}.` },
        400,
      );
    }
    return errorApiResponse(
      { message: 'Server data validation failed. Try again.' },
      400,
    );
  }

  const dbClient = await dependencyContainer.resolve(
    dependencyTokens.DATABASE_SERVER_CLIENT,
  );

  const queryResult = await dbClient.query(async (from) =>
    from('cars')
      .update({
        custom_name: carFormData.custom_name,
        brand: carFormData.brand || undefined,
        model: carFormData.model || undefined,
        production_year: carFormData.production_year || undefined,
        engine_capacity: carFormData.engine_capacity || undefined,
        fuel_type: carFormData.fuel_type || undefined,
        additional_fuel_type: carFormData.additional_fuel_type || undefined,
        drive_type: carFormData.drive_type || undefined,
        transmission_type: carFormData.transmission_type || undefined,
        license_plates: carFormData.license_plates || undefined,
        vin: carFormData.vin || undefined,
        mileage: carFormData.mileage || undefined,
        insurance_expiration: carFormData.insurance_expiration || undefined,
        technical_inspection_expiration:
          carFormData.technical_inspection_expiration || undefined,
      })
      .eq('id', carId || '')
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
