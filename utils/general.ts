import { CarFormValues } from '@/schemas/zod/carFormSchema';
import { Car } from '@/types';

export const CAR_IMAGE_UPLOAD_ERROR_CAUSE = 'image upload error';
const DEFAULT_TIMEOUT = 9000;

// Default vercel serverless function will timeout after 10s so promise should reject in less than that time.
export async function promiseWithTimeout<T>(
  promise: Promise<T>,
  time = DEFAULT_TIMEOUT,
  timeoutError = new Error(
    'There was an error with the upstream service. Try again.',
  ),
) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error()), time);
  });

  return Promise.race([promise, timeoutPromise])
    .then((result) => result as T)
    .catch(() => {
      throw timeoutError;
    });
}

export function unslugify(slug: string, capitalize: boolean) {
  let chunks = slug.trim().split('-');

  if (capitalize) {
    chunks = chunks.map((chunk) => {
      const firstCharacter = chunk.at(0)?.toUpperCase();

      return firstCharacter + chunk.slice(1);
    });
  }

  return chunks.join(' ');
}

export async function hashFile(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  return hashHex;
}

export function getMimeTypeExtensions(mimeTypes: string[]) {
  const typesExtensions = mimeTypes
    .map((mimeType) => mimeType.split('/')[1])
    .join(', ')
    .toUpperCase();

  return typesExtensions;
}

export function mapCarFormValuesToCarObject(formData: CarFormValues): Car {
  return {
    id: crypto.randomUUID(),
    image_url: null,
    custom_name: formData.name,
    brand: formData.brand,
    model: formData.model,
    license_plates: formData.licensePlates,
    additional_fuel_type: formData.additionalFuelType || null,
    created_at: new Date().toISOString(),
    drive_type: formData.driveType || null,
    engine_capacity: formData.engineCapacity,
    fuel_type: formData.fuelType || null,
    mileage: formData.mileage,
    insurance_expiration:
      formData.insuranceExpiration &&
      formData.insuranceExpiration.toISOString(),
    production_year: formData.productionYear,
    transmission_type: formData.transmissionType || null,
    vin: formData.vin,
    created_by: 'optimistic update',
  };
}

export function enqueueRevokeObjectUrl(url: string) {
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export async function delay(delayMilliseconds: number) {
  await new Promise((resolve) =>
    setTimeout(() => resolve(true), delayMilliseconds),
  );
}
