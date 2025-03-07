import { AddCarFormValues } from '@/components/ui/AddCarForm/AddCarForm';
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

export function mutateEmptyFieldsToNull(
  data: Record<string, string | number | null>,
) {
  Object.keys(data).forEach((key) => {
    if (data[key] === '' || Number.isNaN(data[key])) {
      data[key] = null;
    }
  });
}

export function mapAddCarFormValuesToCarObject(
  formData: AddCarFormValues,
): Car {
  return {
    id: crypto.randomUUID(),
    image_url: formData.image && URL.createObjectURL(formData.image),
    custom_name: formData.name || 'New Car',
    brand: formData.brand,
    model: formData.model,
    license_plates: formData.licensePlates,
    additional_fuel_type: formData.additionalFuelType,
    created_at: new Date().toISOString(),
    drive_type: formData.driveType,
    engine_capacity: formData.engineCapacity,
    fuel_type: formData.fuelType,
    mileage: formData.mileage,
    insurance_expiration: formData.insuranceExpiration,
    production_year: formData.productionYear,
    transmission_type: formData.transmissionType,
    vin: formData.vin,
    created_by: 'optimistic update',
  };
}
