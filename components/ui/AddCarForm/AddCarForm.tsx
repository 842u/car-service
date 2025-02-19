import { useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import { Database } from '@/types/supabase';
import {
  carBrandValidationRules,
  carFuelTypePlatesValidationRules,
  carLicensePlatesValidationRules,
  carModelValidationRules,
  carNameValidationRules,
  carVinPlatesValidationRules,
  fuelTypesMapping,
} from '@/utils/validation';

import { Input } from '../Input/Input';

export type AddCarFormValues = {
  name: string | undefined;
  brand: string | undefined;
  model: string | undefined;
  licensePlates: string | undefined;
  vin: string | undefined;
  fuelType: Database['public']['Enums']['fuel'] | undefined;
  additionalFuelType: Database['public']['Enums']['fuel'] | undefined;
  transmissionType: Database['public']['Enums']['transmission'] | undefined;
  driveType: Database['public']['Enums']['drive'] | undefined;
  productionYear: number | undefined;
  engineCapacity: number | undefined;
  mileage: number | undefined;
  insuranceExpiration: Date | undefined;
};

const defaultAddCarFormValues: AddCarFormValues = {
  name: '',
  brand: '',
  model: '',
  licensePlates: '',
  vin: '',
  fuelType: 'gasoline',
  additionalFuelType: 'gasoline',
  transmissionType: 'manual',
  driveType: 'FWD',
  productionYear: 0,
  engineCapacity: 0,
  mileage: 0,
  insuranceExpiration: new Date(),
};

export function AddCarForm() {
  const {
    register,
    formState: { errors },
  } = useForm<AddCarFormValues>({
    mode: 'onTouched',
    defaultValues: defaultAddCarFormValues,
  });
  return (
    <form className="border-accent-200 dark:border-accent-300 bg-light-500 dark:bg-dark-500 rounded-xl border-2 p-10">
      <Input
        errorMessage={errors.name?.message}
        label="Name"
        name="name"
        placeholder="Enter a name for a car ..."
        register={register}
        registerOptions={carNameValidationRules}
        type="text"
      />
      <Input
        errorMessage={errors.brand?.message}
        label="Brand"
        name="brand"
        placeholder="Enter a car brand ..."
        register={register}
        registerOptions={carBrandValidationRules}
        type="text"
      />
      <Input
        errorMessage={errors.model?.message}
        label="Model"
        name="model"
        placeholder="Enter a car model ..."
        register={register}
        registerOptions={carModelValidationRules}
        type="text"
      />
      <Input
        errorMessage={errors.licensePlates?.message}
        label="License Plates"
        name="licensePlates"
        placeholder="Enter a car license plates ..."
        register={register}
        registerOptions={carLicensePlatesValidationRules}
        type="text"
      />
      <Input
        errorMessage={errors.vin?.message}
        label="VIN"
        name="vin"
        placeholder="Enter a car VIN ..."
        register={register}
        registerOptions={carVinPlatesValidationRules}
        type="text"
      />
      <label className="text-sm" htmlFor="fuelType">
        Fuel Type
        <select
          className={twMerge(
            'border-alpha-grey-300 bg-light-600 dark:border-alpha-grey-300 dark:bg-dark-700 block w-full rounded-md border px-4 py-2',
            errors.fuelType?.message
              ? 'border-error-500 bg-error-200 focus:border-error-500 dark:bg-error-900'
              : '',
          )}
          id="fuelType"
          {...register('fuelType', carFuelTypePlatesValidationRules)}
        >
          <option value={1}>1</option>
          <option value={fuelTypesMapping.CNG}>{fuelTypesMapping.CNG}</option>
          <option value={fuelTypesMapping.diesel}>
            {fuelTypesMapping.diesel}
          </option>
        </select>
        {errors.fuelType?.message && (
          <p className="text-error-400 my-1 text-sm whitespace-pre-wrap">
            {errors.fuelType?.message || ' '}
          </p>
        )}
      </label>
    </form>
  );
}
