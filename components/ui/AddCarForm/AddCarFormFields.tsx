import { RefObject, useRef } from 'react';
import { Control, FieldErrors, UseFormRegister } from 'react-hook-form';

import {
  driveTypesMapping,
  fuelTypesMapping,
  transmissionTypesMapping,
} from '@/types';
import {
  carBrandValidationRules,
  carEngineCapacityValidationRules,
  carInsuranceExpirationValidationRules,
  carLicensePlatesValidationRules,
  carMileageValidationRules,
  carModelValidationRules,
  carNameValidationRules,
  carVinValidationRules,
  getCarDatabaseEnumTypeValidationRules,
  getCarProductionYearValidationRules,
  IMAGE_FILE_ACCEPTED_MIME_TYPES,
  imageFileValidationRules,
} from '@/utils/validation';

import { CarImagePreview } from '../CarImagePreview/CarImagePreview';
import { Input } from '../Input/Input';
import { InputImage, InputImageRef } from '../InputImage/InputImage';
import { Select } from '../Select/Select';
import { AddCarFormValues } from './AddCarForm';

type AddCarFormFieldsProps = {
  register: UseFormRegister<AddCarFormValues>;
  control: Control<AddCarFormValues>;
  errors: FieldErrors<AddCarFormValues>;
  fileInputRef: RefObject<InputImageRef | null>;
};

export function AddCarFormFields({
  register,
  control,
  errors,
  fileInputRef,
}: AddCarFormFieldsProps) {
  const carFuelTypeValidationRules = useRef(
    getCarDatabaseEnumTypeValidationRules(fuelTypesMapping),
  );
  const carTransmissionTypeValidationRules = useRef(
    getCarDatabaseEnumTypeValidationRules(transmissionTypesMapping),
  );
  const carDriveTypeValidationRules = useRef(
    getCarDatabaseEnumTypeValidationRules(driveTypesMapping),
  );
  const carProductionYearValidationRules = useRef(
    getCarProductionYearValidationRules(),
  );

  return (
    <>
      <div className="md:flex md:flex-auto md:basis-1/3 md:items-center md:justify-center lg:basis-1/5">
        <InputImage
          ref={fileInputRef}
          accept={IMAGE_FILE_ACCEPTED_MIME_TYPES.join(', ')}
          className="h-64 w-64 overflow-hidden rounded-lg border"
          control={control}
          errorMessage={errors.image?.message}
          ImagePreviewComponent={CarImagePreview}
          label="Image"
          name="image"
          rules={imageFileValidationRules}
        />
      </div>
      <div className="md:flex-auto md:basis-1/3 lg:basis-1/5">
        <Input
          errorMessage={errors.name?.message}
          label="Name"
          maxLength={carNameValidationRules.maxLength.value}
          minLength={carNameValidationRules.minLength.value}
          name="name"
          placeholder="Enter a name for a car ..."
          register={register}
          registerOptions={carNameValidationRules}
          required={!!carNameValidationRules.required}
          type="text"
        />
        <Input
          errorMessage={errors.brand?.message}
          label="Brand"
          maxLength={carBrandValidationRules.maxLength.value}
          minLength={carBrandValidationRules.minLength.value}
          name="brand"
          placeholder="Enter a car brand ..."
          register={register}
          registerOptions={carBrandValidationRules}
          type="text"
        />
        <Input
          errorMessage={errors.model?.message}
          label="Model"
          maxLength={carModelValidationRules.maxLength.value}
          minLength={carModelValidationRules.minLength.value}
          name="model"
          placeholder="Enter a car model ..."
          register={register}
          registerOptions={carModelValidationRules}
          type="text"
        />
        <Input
          errorMessage={errors.licensePlates?.message}
          label="License Plates"
          maxLength={carLicensePlatesValidationRules.maxLength.value}
          minLength={carLicensePlatesValidationRules.minLength.value}
          name="licensePlates"
          placeholder="Enter a car license plates ..."
          register={register}
          registerOptions={carLicensePlatesValidationRules}
          type="text"
        />
        <Input
          errorMessage={errors.vin?.message}
          label="VIN"
          maxLength={carVinValidationRules.maxLength.value}
          minLength={carVinValidationRules.minLength.value}
          name="vin"
          placeholder="Enter a car VIN ..."
          register={register}
          registerOptions={carVinValidationRules}
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
          registerOptions={carFuelTypeValidationRules.current}
        />
        <Select
          errorMessage={errors.additionalFuelType?.message}
          label="Additional Fuel Type"
          name="additionalFuelType"
          options={fuelTypesMapping}
          register={register}
          registerOptions={carFuelTypeValidationRules.current}
        />
        <Select
          errorMessage={errors.transmissionType?.message}
          label="Transmission Type"
          name="transmissionType"
          options={transmissionTypesMapping}
          register={register}
          registerOptions={carTransmissionTypeValidationRules.current}
        />
        <Select
          errorMessage={errors.driveType?.message}
          label="Drive Type"
          name="driveType"
          options={driveTypesMapping}
          register={register}
          registerOptions={carDriveTypeValidationRules.current}
        />
      </div>
      <div className="md:flex-auto md:basis-1/3 lg:basis-1/5">
        <Input
          errorMessage={errors.productionYear?.message}
          label="Production Year"
          max={carProductionYearValidationRules.current.max.value}
          min={carProductionYearValidationRules.current.min.value}
          name="productionYear"
          placeholder="Enter production year ..."
          register={register}
          registerOptions={carProductionYearValidationRules.current}
          type="number"
        />
        <Input
          errorMessage={errors.engineCapacity?.message}
          label="Engine Capacity [cc]"
          min={carEngineCapacityValidationRules.min.value}
          name="engineCapacity"
          placeholder="Enter engine capacity ..."
          register={register}
          registerOptions={carEngineCapacityValidationRules}
          type="number"
        />
        <Input
          errorMessage={errors.mileage?.message}
          label="Mileage [km]"
          min={carMileageValidationRules.min.value}
          name="mileage"
          placeholder="Enter a car mileage ..."
          register={register}
          registerOptions={carMileageValidationRules}
          type="number"
        />
        <Input
          errorMessage={errors.insuranceExpiration?.message}
          label="Insurance Expiration Date"
          name="insuranceExpiration"
          placeholder="Enter insurance expiration date ..."
          register={register}
          registerOptions={carInsuranceExpirationValidationRules}
          type="date"
        />
      </div>
    </>
  );
}
