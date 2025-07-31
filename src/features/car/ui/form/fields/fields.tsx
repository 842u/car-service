import { Control, FieldErrors, UseFormRegister } from 'react-hook-form';

import {
  CAR_VIN_LENGTH,
  CarFormValues,
  MAX_CAR_BRAND_LENGTH,
  MAX_CAR_ENGINE_CAPACITY_VALUE,
  MAX_CAR_LICENSE_PLATES_LENGTH,
  MAX_CAR_MILEAGE_VALUE,
  MAX_CAR_MODEL_LENGTH,
  MAX_CAR_NAME_LENGTH,
  MAX_CAR_PRODUCTION_YEAR_VALUE,
  MIN_CAR_BRAND_LENGTH,
  MIN_CAR_ENGINE_CAPACITY_VALUE,
  MIN_CAR_INSURANCE_EXPIRATION_DATE,
  MIN_CAR_LICENSE_PLATES_LENGTH,
  MIN_CAR_MILEAGE_VALUE,
  MIN_CAR_MODEL_LENGTH,
  MIN_CAR_NAME_LENGTH,
  MIN_CAR_PRODUCTION_YEAR_VALUE,
  MIN_CAR_TECHNICAL_INSPECTION_EXPIRATION_DATE,
} from '@/schemas/zod/carFormSchema';
import {
  driveTypesMapping,
  fuelTypesMapping,
  transmissionTypesMapping,
} from '@/types';
import { Form } from '@/ui/form/form';

import { CarImage } from '../../image/image';

type FormFieldsProps = {
  register: UseFormRegister<CarFormValues>;
  control: Control<CarFormValues>;
  errors: FieldErrors<CarFormValues>;
  inputImageUrl: string | null;
  onImageInputChange: (file: File | undefined | null) => void;
};

export function FormFields({
  register,
  control,
  errors,
  inputImageUrl,
  onImageInputChange,
}: FormFieldsProps) {
  return (
    <>
      <Form.InputWrapper className="md:justify-center">
        <Form.InputImage
          control={control}
          errorMessage={errors.image?.message}
          label="Image"
          name="image"
          onChange={onImageInputChange}
        >
          <CarImage src={inputImageUrl} />
        </Form.InputImage>
      </Form.InputWrapper>
      <Form.InputWrapper>
        <Form.Input
          required
          errorMessage={errors.custom_name?.message}
          label="Name"
          maxLength={MAX_CAR_NAME_LENGTH}
          minLength={MIN_CAR_NAME_LENGTH}
          name="custom_name"
          placeholder="Enter a name for a car ..."
          register={register}
          type="text"
        />
        <Form.Input
          errorMessage={errors.brand?.message}
          label="Brand"
          maxLength={MAX_CAR_BRAND_LENGTH}
          minLength={MIN_CAR_BRAND_LENGTH}
          name="brand"
          placeholder="Enter a car brand ..."
          register={register}
          type="text"
        />
        <Form.Input
          errorMessage={errors.model?.message}
          label="Model"
          maxLength={MAX_CAR_MODEL_LENGTH}
          minLength={MIN_CAR_MODEL_LENGTH}
          name="model"
          placeholder="Enter a car model ..."
          register={register}
          type="text"
        />
        <Form.Input
          errorMessage={errors.production_year?.message}
          label="Production Year"
          max={MAX_CAR_PRODUCTION_YEAR_VALUE}
          min={MIN_CAR_PRODUCTION_YEAR_VALUE}
          name="production_year"
          placeholder="Enter production year ..."
          register={register}
          registerOptions={{ valueAsNumber: true }}
          type="number"
        />
        <Form.Input
          errorMessage={errors.license_plates?.message}
          label="License Plates"
          maxLength={MAX_CAR_LICENSE_PLATES_LENGTH}
          minLength={MIN_CAR_LICENSE_PLATES_LENGTH}
          name="license_plates"
          placeholder="Enter a car license plates ..."
          register={register}
          type="text"
        />
        <Form.Input
          errorMessage={errors.vin?.message}
          label="VIN"
          maxLength={CAR_VIN_LENGTH}
          minLength={CAR_VIN_LENGTH}
          name="vin"
          placeholder="Enter a car VIN ..."
          register={register}
          type="text"
        />
      </Form.InputWrapper>
      <Form.InputWrapper>
        <div className="bg-alpha-grey-300 mb-4 h-[1px] w-full md:block lg:hidden" />
        <Form.Input
          errorMessage={errors.engine_capacity?.message}
          label="Engine Capacity [cc]"
          max={MAX_CAR_ENGINE_CAPACITY_VALUE}
          min={MIN_CAR_ENGINE_CAPACITY_VALUE}
          name="engine_capacity"
          placeholder="Enter engine capacity ..."
          register={register}
          registerOptions={{ valueAsNumber: true }}
          type="number"
        />
        <Form.Select
          errorMessage={errors.fuel_type?.message}
          label="Fuel Type"
          name="fuel_type"
          options={fuelTypesMapping}
          register={register}
        />
        <Form.Select
          errorMessage={errors.additional_fuel_type?.message}
          label="Additional Fuel Type"
          name="additional_fuel_type"
          options={fuelTypesMapping}
          register={register}
        />
        <Form.Select
          errorMessage={errors.drive_type?.message}
          label="Drive Type"
          name="drive_type"
          options={driveTypesMapping}
          register={register}
        />
        <Form.Select
          errorMessage={errors.transmission_type?.message}
          label="Transmission Type"
          name="transmission_type"
          options={transmissionTypesMapping}
          register={register}
        />
      </Form.InputWrapper>

      <Form.InputWrapper>
        <div className="bg-alpha-grey-300 mb-4 h-[1px] w-full md:block lg:hidden" />
        <Form.Input
          errorMessage={errors.mileage?.message}
          label="Mileage [km]"
          max={MAX_CAR_MILEAGE_VALUE}
          min={MIN_CAR_MILEAGE_VALUE}
          name="mileage"
          placeholder="Enter a car mileage ..."
          register={register}
          registerOptions={{ valueAsNumber: true }}
          type="number"
        />
        <Form.Input
          errorMessage={errors.insurance_expiration?.message}
          label="Insurance Expiration Date"
          min={MIN_CAR_INSURANCE_EXPIRATION_DATE}
          name="insurance_expiration"
          placeholder="Enter insurance expiration date ..."
          register={register}
          type="date"
        />
        <Form.Input
          errorMessage={errors.technical_inspection_expiration?.message}
          label="Technical Inspection Expiration Date"
          min={MIN_CAR_TECHNICAL_INSPECTION_EXPIRATION_DATE}
          name="technical_inspection_expiration"
          placeholder="Enter technical inspection expiration date ..."
          register={register}
          type="date"
        />
      </Form.InputWrapper>
    </>
  );
}
