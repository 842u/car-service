import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { RouteHandlerResponse } from '@/types';
import { createClient } from '@/utils/supabase/server';
import { carFormSchema, CarFormValues } from '@/utils/validation';

export type AddCarFormValuesToValidate = Omit<CarFormValues, 'image'>;
export type apiCarPostResponse = { id: string };

export async function POST(request: NextRequest) {
  if (request.headers.get('content-type') !== 'application/json')
    return NextResponse.json<RouteHandlerResponse>(
      { error: { message: 'Unsupported Media Type' }, data: null },
      { status: 415 },
    );

  const supabase = await createClient();

  const formData = (await request.json()) as AddCarFormValuesToValidate;

  try {
    carFormSchema.parse(formData);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json<RouteHandlerResponse>(
        {
          error: {
            message: `Server validation failed: ${error.issues.map((issueError) => `${issueError.message}\n`)}`,
          },
          data: null,
        },
        { status: 400 },
      );
    }
    if (error instanceof Error) {
      return NextResponse.json<RouteHandlerResponse>(
        {
          error: { message: `Server validation failed: ${error.message}.` },
          data: null,
        },
        { status: 400 },
      );
    }
    return NextResponse.json<RouteHandlerResponse>(
      {
        error: { message: 'Server data validation failed. Try again.' },
        data: null,
      },
      { status: 400 },
    );
  }

  /*
   * While posting new car with image, its id is needed.
   * Due to RLS policies on "cars" table for SELECT,
   * usage of RPC is required to immediately return a new car id.
   * User to be able to select a car, must have ownership of that specific car,
   * and corresponding row in "cars_ownerships" table should exist.
   * However rows in "cars_ownerships" are created AFTER INSERT on "cars" table,
   * so RLS restricts immediate SELECT while using "supabase.from().insert().select()".
   */
  const { data, error } = await supabase.rpc('create_new_car', {
    additional_fuel_type: formData.additionalFuelType || undefined,
    custom_name: formData.name || 'New car',
    brand: formData.brand || undefined,
    drive_type: formData.driveType || undefined,
    engine_capacity: formData.engineCapacity || undefined,
    fuel_type: formData.fuelType || undefined,
    insurance_expiration:
      (formData.insuranceExpiration &&
        formData.insuranceExpiration.toISOString()) ||
      undefined,
    license_plates: formData.licensePlates || undefined,
    mileage: formData.mileage || undefined,
    model: formData.model || undefined,
    production_year: formData.productionYear || undefined,
    transmission_type: formData.transmissionType || undefined,
    vin: formData.vin || undefined,
  });

  if (error) {
    return NextResponse.json<RouteHandlerResponse>(
      {
        error: { message: `Database connection failed: ${error.message}` },
        data: null,
      },
      { status: 502 },
    );
  }

  return NextResponse.json<RouteHandlerResponse<apiCarPostResponse>>(
    {
      data: { id: data },
      error: null,
    },
    { status: 201 },
  );
}
