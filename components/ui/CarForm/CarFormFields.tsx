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

import { CarImage } from '../CarImage/CarImage';
import { Input } from '../Input/Input';
import { InputImage } from '../InputImage/InputImage';
import { Select } from '../Select/Select';

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
      <div className="md:flex md:flex-auto md:basis-1/3 md:items-center md:justify-center lg:basis-1/5">
        <InputImage
          control={control}
          errorMessage={errors.image?.message}
          label="Image"
          name="image"
          onChange={onInputImageChange}
        >
          <CarImage src={inputImageUrl} />
        </InputImage>
      </div>
      <div className="md:flex-auto md:basis-1/3 lg:basis-1/5">
        <Input
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
        <Input
          errorMessage={errors.brand?.message}
          label="Brand"
          maxLength={MAX_CAR_BRAND_LENGTH}
          minLength={MIN_CAR_BRAND_LENGTH}
          name="brand"
          placeholder="Enter a car brand ..."
          register={register}
          type="text"
        />
        <Input
          errorMessage={errors.model?.message}
          label="Model"
          maxLength={MAX_CAR_MODEL_LENGTH}
          minLength={MIN_CAR_MODEL_LENGTH}
          name="model"
          placeholder="Enter a car model ..."
          register={register}
          type="text"
        />
        <Input
          errorMessage={errors.licensePlates?.message}
          label="License Plates"
          maxLength={MAX_CAR_LICENSE_PLATES_LENGTH}
          minLength={MIN_CAR_LICENSE_PLATES_LENGTH}
          name="licensePlates"
          placeholder="Enter a car license plates ..."
          register={register}
          type="text"
        />
        <Input
          errorMessage={errors.vin?.message}
          label="VIN"
          maxLength={CAR_VIN_LENGTH}
          minLength={CAR_VIN_LENGTH}
          name="vin"
          placeholder="Enter a car VIN ..."
          register={register}
          type="text"
        />
      </div>
      <div className="md:flex-auto md:basis-1/3 lg:basis-1/5">
        <Select
          errorMessage={errors.fuelType?.message}
          label="Fuel Type"
          name="fuelType"
          options={fuelTypesMapping}
          register={register}
        />
        <Select
          errorMessage={errors.additionalFuelType?.message}
          label="Additional Fuel Type"
          name="additionalFuelType"
          options={fuelTypesMapping}
          register={register}
        />
        <Select
          errorMessage={errors.transmissionType?.message}
          label="Transmission Type"
          name="transmissionType"
          options={transmissionTypesMapping}
          register={register}
        />
        <Select
          errorMessage={errors.driveType?.message}
          label="Drive Type"
          name="driveType"
          options={driveTypesMapping}
          register={register}
        />
      </div>
      <div className="md:flex-auto md:basis-1/3 lg:basis-1/5">
        <Input
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
        <Input
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
        <Input
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
        <Input
          errorMessage={errors.insuranceExpiration?.message}
          label="Insurance Expiration Date"
          min={MIN_CAR_INSURANCE_EXPIRATION_DATE}
          name="insuranceExpiration"
          placeholder="Enter insurance expiration date ..."
          register={register}
          type="date"
        />
      </div>
    </>
  );
}
