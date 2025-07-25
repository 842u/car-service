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
