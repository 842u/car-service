import { Control, FieldErrors, UseFormRegister } from 'react-hook-form';

import { CarFormValues } from '@/schemas/zod/carFormSchema';
import {
  CAR_VIN_LENGTH,
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
} from '@/schemas/zod/common';
import {
  driveTypesMapping,
  fuelTypesMapping,
  transmissionTypesMapping,
} from '@/types';

import { CarImage } from '../../images/CarImage/CarImage';
import { Form } from '../base/Form/Form';

type CarFormFieldsProps = {
  register: UseFormRegister<CarFormValues>;
  control: Control<CarFormValues>;
  errors: FieldErrors<CarFormValues>;
  inputImageUrl: string | null;
  onInputImageChange: (file: File | undefined | null) => void;
};

export function CarFormFields({
  register,
  control,
  errors,
  inputImageUrl,
  onInputImageChange,
}: CarFormFieldsProps) {
  return (
    <>
      <Form.InputWrapper>
        <Form.InputImage
          control={control}
          errorMessage={errors.image?.message}
          label="Image"
          name="image"
          onChange={onInputImageChange}
        >
          <CarImage src={inputImageUrl} />
        </Form.InputImage>
      </Form.InputWrapper>
      <Form.InputWrapper>
        <Form.Input
          required
          errorMessage={errors.name?.message}
          label="Name"
          maxLength={MAX_CAR_NAME_LENGTH}
          minLength={MIN_CAR_NAME_LENGTH}
          name="name"
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
          errorMessage={errors.licensePlates?.message}
          label="License Plates"
          maxLength={MAX_CAR_LICENSE_PLATES_LENGTH}
          minLength={MIN_CAR_LICENSE_PLATES_LENGTH}
          name="licensePlates"
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
        <Form.Select
          errorMessage={errors.fuelType?.message}
          label="Fuel Type"
          name="fuelType"
          options={fuelTypesMapping}
          register={register}
        />
        <Form.Select
          errorMessage={errors.additionalFuelType?.message}
          label="Additional Fuel Type"
          name="additionalFuelType"
          options={fuelTypesMapping}
          register={register}
        />
        <Form.Select
          errorMessage={errors.transmissionType?.message}
          label="Transmission Type"
          name="transmissionType"
          options={transmissionTypesMapping}
          register={register}
        />
        <Form.Select
          errorMessage={errors.driveType?.message}
          label="Drive Type"
          name="driveType"
          options={driveTypesMapping}
          register={register}
        />
      </Form.InputWrapper>
      <Form.InputWrapper>
        <Form.Input
          errorMessage={errors.productionYear?.message}
          label="Production Year"
          max={MAX_CAR_PRODUCTION_YEAR_VALUE}
          min={MIN_CAR_PRODUCTION_YEAR_VALUE}
          name="productionYear"
          placeholder="Enter production year ..."
          register={register}
          registerOptions={{ valueAsNumber: true }}
          type="number"
        />
        <Form.Input
          errorMessage={errors.engineCapacity?.message}
          label="Engine Capacity [cc]"
          max={MAX_CAR_ENGINE_CAPACITY_VALUE}
          min={MIN_CAR_ENGINE_CAPACITY_VALUE}
          name="engineCapacity"
          placeholder="Enter engine capacity ..."
          register={register}
          registerOptions={{ valueAsNumber: true }}
          type="number"
        />
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
          errorMessage={errors.insuranceExpiration?.message}
          label="Insurance Expiration Date"
          min={MIN_CAR_INSURANCE_EXPIRATION_DATE}
          name="insuranceExpiration"
          placeholder="Enter insurance expiration date ..."
          register={register}
          type="date"
        />
      </Form.InputWrapper>
    </>
  );
}
