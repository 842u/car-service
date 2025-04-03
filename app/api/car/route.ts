import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { carFormSchema, CarFormValues } from '@/schemas/zod/carFormSchema';
import { RouteHandlerResponse } from '@/types';
import { createClient } from '@/utils/supabase/server';

type CarFormValuesToValidate = Omit<CarFormValues, 'image'>;

export type ApiCarResponse = { id: string };
export type ApiCarRequestBody = {
  carFormData: CarFormValuesToValidate;
  carId: string | null;
};

export const maxDuration = 10;

export async function POST(request: NextRequest) {
  if (request.headers.get('content-type') !== 'application/json')
    return NextResponse.json<RouteHandlerResponse>(
      { error: { message: 'Unsupported Media Type' }, data: null },
      { status: 415 },
    );

  const { carFormData } = (await request.json()) as ApiCarRequestBody;

  try {
    carFormSchema.parse(carFormData);
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

  const supabase = await createClient();

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
    additional_fuel_type: carFormData.additionalFuelType || undefined,
    custom_name: carFormData.name || 'New car',
    brand: carFormData.brand || undefined,
    drive_type: carFormData.driveType || undefined,
    engine_capacity: carFormData.engineCapacity || undefined,
    fuel_type: carFormData.fuelType || undefined,
    insurance_expiration:
      (carFormData.insuranceExpiration &&
        carFormData.insuranceExpiration.toString()) ||
      undefined,
    license_plates: carFormData.licensePlates || undefined,
    mileage: carFormData.mileage || undefined,
    model: carFormData.model || undefined,
    production_year: carFormData.productionYear || undefined,
    transmission_type: carFormData.transmissionType || undefined,
    vin: carFormData.vin || undefined,
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

  return NextResponse.json<RouteHandlerResponse<ApiCarResponse>>(
    {
      data: { id: data },
      error: null,
    },
    { status: 201 },
  );
}

export async function PATCH(request: NextRequest) {
  if (request.headers.get('content-type') !== 'application/json')
    return NextResponse.json<RouteHandlerResponse>(
      { error: { message: 'Unsupported Media Type' }, data: null },
      { status: 415 },
    );

  const { carFormData, carId } = (await request.json()) as ApiCarRequestBody;

  try {
    carFormSchema.parse(carFormData);
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

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('cars')
    .update({
      custom_name: carFormData.name,
      brand: carFormData.brand,
      model: carFormData.model,
      production_year: carFormData.productionYear,
      engine_capacity: carFormData.engineCapacity,
      fuel_type: carFormData.fuelType !== '' ? carFormData.fuelType : null,
      additional_fuel_type:
        carFormData.additionalFuelType !== ''
          ? carFormData.additionalFuelType
          : null,
      drive_type: carFormData.driveType !== '' ? carFormData.driveType : null,
      transmission_type:
        carFormData.transmissionType !== ''
          ? carFormData.transmissionType
          : null,
      license_plates: carFormData.licensePlates,
      vin: carFormData.vin,
      mileage: carFormData.mileage,
      insurance_expiration: carFormData.insuranceExpiration?.toString(),
    })
    .eq('id', carId || '')
    .select('id')
    .single();

  if (error) {
    return NextResponse.json<RouteHandlerResponse>(
      {
        error: { message: `Database connection failed: ${error.message}` },
        data: null,
      },
      { status: 502 },
    );
  }

  return NextResponse.json<RouteHandlerResponse<ApiCarResponse>>(
    {
      data: { id: data.id },
      error: null,
    },
    { status: 201 },
  );
}
