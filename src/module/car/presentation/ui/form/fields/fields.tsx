import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';

import {
  MAX_BRAND_LENGTH,
  MIN_BRAND_LENGTH,
} from '@/car/domain/car/value-object/brand/brand.schema';
import {
  MAX_CUSTOM_NAME_LENGTH,
  MIN_CUSTOM_NAME_LENGTH,
} from '@/car/domain/car/value-object/custom-name/custom-name.schema';
import { driveValues } from '@/car/domain/car/value-object/drive-type/drive-type.schema';
import {
  MAX_ENGINE_CAPACITY_VALUE,
  MIN_ENGINE_CAPACITY_VALUE,
} from '@/car/domain/car/value-object/engine-capacity/engine-capacity.schema';
import { fuelValues } from '@/car/domain/car/value-object/fuel-type/fuel-type.schema';
import { MIN_INSURANCE_EXPIRATION_DATE } from '@/car/domain/car/value-object/insurance-expiration/insurance-expiration.schema';
import {
  MAX_LICENSE_PLATES_LENGTH,
  MIN_LICENSE_PLATES_LENGTH,
} from '@/car/domain/car/value-object/license-plates/license-plates.schema';
import {
  MAX_MILEAGE_VALUE,
  MIN_MILEAGE_VALUE,
} from '@/car/domain/car/value-object/mileage/mileage.schema';
import {
  MAX_MODEL_LENGTH,
  MIN_MODEL_LENGTH,
} from '@/car/domain/car/value-object/model/model.schema';
import {
  MAX_PRODUCTION_YEAR_VALUE,
  MIN_PRODUCTION_YEAR_VALUE,
} from '@/car/domain/car/value-object/production-year/production-year.schema';
import { MIN_TECHNICAL_INSPECTION_EXPIRATION_DATE } from '@/car/domain/car/value-object/technical-inspection-expiration/technical-inspection-expiration.schema';
import { transmissionValues } from '@/car/domain/car/value-object/transmission-type/transmission-type.schema';
import { VIN_LENGTH } from '@/car/domain/car/value-object/vin/vin.schema';
import type { CarFormData } from '@/car/interface/ui/car-form.schema';
import { Form } from '@/ui/form/form';

import { CarImage } from '../../image/image';

const FUEL_TYPE_OPTIONS = Object.fromEntries(
  fuelValues.map((value) => [value, value]),
);
const DRIVE_TYPE_OPTIONS = Object.fromEntries(
  driveValues.map((value) => [value, value]),
);
const TRANSMISSION_TYPE_OPTIONS = Object.fromEntries(
  transmissionValues.map((value) => [value, value]),
);

type FormFieldsProps = {
  register: UseFormRegister<CarFormData>;
  control: Control<CarFormData>;
  errors: FieldErrors<CarFormData>;
  imageUrl?: string | null;
};

export function FormFields({
  register,
  control,
  errors,
  imageUrl,
}: FormFieldsProps) {
  return (
    <>
      <Form.InputWrapper className="md:justify-center">
        <Form.InputImage
          control={control}
          errorMessage={errors.image?.message}
          label="Image"
          name="image"
        >
          {(previewUrl) => <CarImage src={previewUrl || imageUrl} />}
        </Form.InputImage>
      </Form.InputWrapper>
      <Form.InputWrapper>
        <Form.Input
          required
          errorMessage={errors.customName?.message}
          label="Name"
          maxLength={MAX_CUSTOM_NAME_LENGTH}
          minLength={MIN_CUSTOM_NAME_LENGTH}
          name="customName"
          placeholder="Enter a name for a car ..."
          register={register}
          type="text"
        />
        <Form.Input
          errorMessage={errors.brand?.message}
          label="Brand"
          maxLength={MAX_BRAND_LENGTH}
          minLength={MIN_BRAND_LENGTH}
          name="brand"
          placeholder="Enter a car brand ..."
          register={register}
          type="text"
        />
        <Form.Input
          errorMessage={errors.model?.message}
          label="Model"
          maxLength={MAX_MODEL_LENGTH}
          minLength={MIN_MODEL_LENGTH}
          name="model"
          placeholder="Enter a car model ..."
          register={register}
          type="text"
        />
        <Form.Input
          errorMessage={errors.productionYear?.message}
          label="Production Year"
          max={MAX_PRODUCTION_YEAR_VALUE}
          min={MIN_PRODUCTION_YEAR_VALUE}
          name="productionYear"
          placeholder="Enter production year ..."
          register={register}
          registerOptions={{ valueAsNumber: true }}
          type="number"
        />
        <Form.Input
          errorMessage={errors.licensePlates?.message}
          label="License Plates"
          maxLength={MAX_LICENSE_PLATES_LENGTH}
          minLength={MIN_LICENSE_PLATES_LENGTH}
          name="licensePlates"
          placeholder="Enter a car license plates ..."
          register={register}
          type="text"
        />
        <Form.Input
          errorMessage={errors.vin?.message}
          label="VIN"
          maxLength={VIN_LENGTH}
          minLength={VIN_LENGTH}
          name="vin"
          placeholder="Enter a car VIN ..."
          register={register}
          type="text"
        />
      </Form.InputWrapper>
      <Form.InputWrapper>
        <div className="bg-alpha-grey-300 mb-4 h-px w-full md:block lg:hidden" />
        <Form.Input
          errorMessage={errors.engineCapacity?.message}
          label="Engine Capacity [cc]"
          max={MAX_ENGINE_CAPACITY_VALUE}
          min={MIN_ENGINE_CAPACITY_VALUE}
          name="engineCapacity"
          placeholder="Enter engine capacity ..."
          register={register}
          registerOptions={{ valueAsNumber: true }}
          type="number"
        />
        <Form.Select
          errorMessage={errors.fuelType?.message}
          label="Fuel Type"
          name="fuelType"
          options={FUEL_TYPE_OPTIONS}
          register={register}
        />
        <Form.Select
          errorMessage={errors.additionalFuelType?.message}
          label="Additional Fuel Type"
          name="additionalFuelType"
          options={FUEL_TYPE_OPTIONS}
          register={register}
        />
        <Form.Select
          errorMessage={errors.driveType?.message}
          label="Drive Type"
          name="driveType"
          options={DRIVE_TYPE_OPTIONS}
          register={register}
        />
        <Form.Select
          errorMessage={errors.transmissionType?.message}
          label="Transmission Type"
          name="transmissionType"
          options={TRANSMISSION_TYPE_OPTIONS}
          register={register}
        />
      </Form.InputWrapper>

      <Form.InputWrapper>
        <div className="bg-alpha-grey-300 mb-4 h-px w-full md:block lg:hidden" />
        <Form.Input
          errorMessage={errors.mileage?.message}
          label="Mileage [km]"
          max={MAX_MILEAGE_VALUE}
          min={MIN_MILEAGE_VALUE}
          name="mileage"
          placeholder="Enter a car mileage ..."
          register={register}
          registerOptions={{ valueAsNumber: true }}
          type="number"
        />
        <Form.Input
          errorMessage={errors.insuranceExpiration?.message}
          label="Insurance Expiration Date"
          min={MIN_INSURANCE_EXPIRATION_DATE}
          name="insuranceExpiration"
          placeholder="Enter insurance expiration date ..."
          register={register}
          type="date"
        />
        <Form.Input
          errorMessage={errors.technicalInspectionExpiration?.message}
          label="Technical Inspection Expiration Date"
          min={MIN_TECHNICAL_INSPECTION_EXPIRATION_DATE}
          name="technicalInspectionExpiration"
          placeholder="Enter technical inspection expiration date ..."
          register={register}
          type="date"
        />
      </Form.InputWrapper>
    </>
  );
}
