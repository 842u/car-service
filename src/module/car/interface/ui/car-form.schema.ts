import { z } from 'zod';

import { brandSchema } from '@/car/domain/car/value-object/brand/brand.schema';
import { customNameSchema } from '@/car/domain/car/value-object/custom-name/custom-name.schema';
import { driveTypeSchema } from '@/car/domain/car/value-object/drive-type/drive-type.schema';
import { engineCapacitySchema } from '@/car/domain/car/value-object/engine-capacity/engine-capacity.schema';
import { fuelTypeSchema } from '@/car/domain/car/value-object/fuel-type/fuel-type.schema';
import { insuranceExpirationSchema } from '@/car/domain/car/value-object/insurance-expiration/insurance-expiration.schema';
import { licensePlatesSchema } from '@/car/domain/car/value-object/license-plates/license-plates.schema';
import { mileageSchema } from '@/car/domain/car/value-object/mileage/mileage.schema';
import { modelSchema } from '@/car/domain/car/value-object/model/model.schema';
import { productionYearSchema } from '@/car/domain/car/value-object/production-year/production-year.schema';
import { technicalInspectionExpirationSchema } from '@/car/domain/car/value-object/technical-inspection-expiration/technical-inspection-expiration.schema';
import { transmissionTypeSchema } from '@/car/domain/car/value-object/transmission-type/transmission-type.schema';
import { vinSchema } from '@/car/domain/car/value-object/vin/vin.schema';
import { imageFileSchema } from '@/common/interface/schema/image-file.schema';
import {
  nullifyEmptyString,
  nullifyNaN,
} from '@/common/interface/schema/nullify.schema';
import { parseDateToYyyyMmDd } from '@/lib/utils';

z.config({
  jitless: true,
});

const EXPIRATION_DATE_REQUIRED_MESSAGE = 'Date is required.';
const EXPIRATION_DATE_TYPE_MESSAGE = 'Invalid date.';

// The date-picker submits a Date; the domain schema validates the persisted
// `yyyy-mm-dd` string shape (and the minimum-date rule), so coerce then pipe.
function datePickerSchema(domainSchema: typeof insuranceExpirationSchema) {
  return z.coerce
    .date({
      error: (issue) =>
        issue.input === undefined
          ? EXPIRATION_DATE_REQUIRED_MESSAGE
          : EXPIRATION_DATE_TYPE_MESSAGE,
    })
    .transform((date) => parseDateToYyyyMmDd(date))
    .pipe(domainSchema);
}

export const carFormDataSchema = z.object({
  image: imageFileSchema.nullable().optional(),
  customName: customNameSchema,
  brand: nullifyEmptyString(brandSchema),
  model: nullifyEmptyString(modelSchema),
  licensePlates: nullifyEmptyString(licensePlatesSchema),
  vin: nullifyEmptyString(vinSchema),
  engineCapacity: nullifyNaN(engineCapacitySchema),
  mileage: nullifyNaN(mileageSchema),
  productionYear: nullifyNaN(productionYearSchema),
  fuelType: nullifyEmptyString(fuelTypeSchema),
  additionalFuelType: nullifyEmptyString(fuelTypeSchema),
  transmissionType: nullifyEmptyString(transmissionTypeSchema),
  driveType: nullifyEmptyString(driveTypeSchema),
  insuranceExpiration: nullifyEmptyString(
    datePickerSchema(insuranceExpirationSchema),
  ),
  technicalInspectionExpiration: nullifyEmptyString(
    datePickerSchema(technicalInspectionExpirationSchema),
  ),
});

export type CarFormData = z.infer<typeof carFormDataSchema>;
