import { Route } from 'next';
import { useContext, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { apiCarPostResponse } from '@/app/api/car/route';
import { ToastsContext } from '@/context/ToastsContext';
import {
  Drive,
  driveTypesMapping,
  Fuel,
  fuelTypesMapping,
  RouteHandlerResponse,
  Transmission,
  transmissionTypesMapping,
} from '@/types';
import { hashFile, mutateEmptyFieldsToNull } from '@/utils/general';
import { createClient } from '@/utils/supabase/client';
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

import { Button } from '../Button/Button';
import { CarImagePreview } from '../CarImagePreview/CarImagePreview';
import { Input } from '../Input/Input';
import { InputImage, InputImageRef } from '../InputImage/InputImage';
import { Select } from '../Select/Select';
import { SubmitButton } from '../SubmitButton/SubmitButton';

export type AddCarFormValues = {
  image: File | null;
  name: string | null;
  brand: string | null;
  model: string | null;
  licensePlates: string | null;
  vin: string | null;
  fuelType: Fuel | null;
  additionalFuelType: Fuel | null;
  transmissionType: Transmission | null;
  driveType: Drive | null;
  productionYear: number | null;
  engineCapacity: number | null;
  mileage: number | null;
  insuranceExpiration: string | null;
};

export const defaultAddCarFormValues: AddCarFormValues = {
  image: null,
  name: null,
  brand: null,
  model: null,
  licensePlates: null,
  vin: null,
  fuelType: null,
  additionalFuelType: null,
  transmissionType: null,
  driveType: null,
  productionYear: null,
  engineCapacity: null,
  mileage: null,
  insuranceExpiration: null,
};

type AddCarFormProps = {
  onSubmit?: () => void;
};

export function AddCarForm({ onSubmit }: AddCarFormProps) {
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
  const fileInputRef = useRef<InputImageRef>(null);

  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useForm<AddCarFormValues>({
    mode: 'all',
    defaultValues: defaultAddCarFormValues,
  });

  const { addToast } = useContext(ToastsContext);

  const resetButtonHandler = () => {
    fileInputRef.current?.reset();
    reset();
  };

  const submitHandler: SubmitHandler<AddCarFormValues> = async (formData) => {
    onSubmit && onSubmit();

    const supabase = createClient();

    const { image, ...data } = formData;

    mutateEmptyFieldsToNull(data);

    const jsonDataToValidate = JSON.stringify(data);

    const url = new URL(window.location.origin);
    url.pathname = '/api/car' satisfies Route;

    let newCarResponse: Response | null = null;
    try {
      newCarResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonDataToValidate,
      });
    } catch (error) {
      if (error instanceof Error) addToast(error.message, 'error');
    }

    const { message, error, payload } =
      (await newCarResponse?.json()) as RouteHandlerResponse<apiCarPostResponse>;

    if (error) {
      addToast(error, 'error');
    }

    if (image && payload?.id) {
      const hashedFile = await hashFile(image);

      const { error: imageUploadError } = await supabase.storage
        .from('cars_images')
        .upload(`${payload.id}/${hashedFile}`, image);

      imageUploadError &&
        addToast(
          'Car added successfully, but image upload failed. You can edit and upload the image in your car details.',
          'warning',
        );
      message && !imageUploadError && addToast(message, 'success');

      return;
    }

    message && addToast(message, 'success');

    fileInputRef.current?.reset();
    reset();
  };

  return (
    <form
      className="border-accent-200 dark:border-accent-300 bg-light-500 dark:bg-dark-500 rounded-xl border-2 p-10 md:flex md:flex-wrap md:gap-x-10 lg:gap-x-5 lg:p-5"
      onSubmit={handleSubmit(submitHandler)}
    >
      <h2 className="text-xl">Add a new car</h2>
      <div className="bg-alpha-grey-200 my-4 h-[1px] w-full" />
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
      <div className="mt-5 flex gap-10 md:flex-auto md:basis-full lg:justify-end lg:gap-5">
        <Button
          className="w-full lg:max-w-48"
          disabled={isSubmitting || !isDirty}
          onClick={resetButtonHandler}
        >
          Reset
        </Button>
        <SubmitButton
          className="w-full lg:max-w-48"
          disabled={!isValid || isSubmitting}
          isSubmitting={isSubmitting}
        >
          Save
        </SubmitButton>
      </div>
    </form>
  );
}
