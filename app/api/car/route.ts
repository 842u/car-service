import { NextRequest, NextResponse } from 'next/server';

import { AddCarFormValues } from '@/components/ui/AddCarForm/AddCarForm';
import { RouteHandlerResponse } from '@/types';
import { createClient } from '@/utils/supabase/server';
import { validateAddCarFormData } from '@/utils/validation';

export type AddCarFormValuesToValidate = Omit<AddCarFormValues, 'image'>;
export type apiCarPostResponse = { id: string };

export async function POST(request: NextRequest) {
  if (request.headers.get('content-type') !== 'application/json')
    return NextResponse.json<RouteHandlerResponse>(
      { error: 'Unsupported Media Type', message: null },
      { status: 415 },
    );

  const supabase = await createClient();

  const formData = (await request.json()) as AddCarFormValuesToValidate;

  try {
    validateAddCarFormData(formData);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json<RouteHandlerResponse>(
        { error: `Server validation failed: ${error.message}`, message: null },
        { status: 400 },
      );
    }

    return NextResponse.json<RouteHandlerResponse>(
      { error: 'Server data validation failed. Try again.', message: null },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from('cars')
    .insert({
      custom_name: formData.name || 'Your new car.',
      brand: formData.brand,
      additional_fuel_type: formData.additionalFuelType,
      drive_type: formData.driveType,
      engine_capacity: formData.engineCapacity,
      fuel_type: formData.fuelType,
      insurance_expiration: formData.insuranceExpiration,
      license_plates: formData.licensePlates,
      mileage: formData.mileage,
      model: formData.model,
      production_year: formData.productionYear,
      transmission_type: formData.transmissionType,
      vin: formData.vin,
    })
    .select('id');

  if (error) {
    return NextResponse.json<RouteHandlerResponse>(
      { error: `Database connection failed: ${error.message}`, message: null },
      { status: 502 },
    );
  }

  return NextResponse.json<RouteHandlerResponse<apiCarPostResponse>>(
    {
      error: null,
      message: 'New car successfully added.',
      payload: {
        id: data[0].id,
      },
    },
    { status: 201 },
  );
}
