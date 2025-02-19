import { useForm } from 'react-hook-form';

import {
  carBrandValidationRules,
  carLicensePlatesValidationRules,
  carModelValidationRules,
  carNameValidationRules,
  carVinValidationRules,
  driveTypesMapping,
  fuelTypesMapping,
  getCarDatabaseEnumTypeValidationRules,
  transmissionTypesMapping,
} from '@/utils/validation';

import { Input } from '../Input/Input';
import { Select } from '../Select/Select';

type Fuel = keyof typeof fuelTypesMapping;
type Transmission = keyof typeof transmissionTypesMapping;
type Drive = keyof typeof driveTypesMapping;

export type AddCarFormValues = {
  name: string | undefined;
  brand: string | undefined;
  model: string | undefined;
  licensePlates: string | undefined;
  vin: string | undefined;
  fuelType: Fuel;
  additionalFuelType: Fuel;
  transmissionType: Transmission;
  driveType: Drive;
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
  fuelType: '---',
  additionalFuelType: '---',
  transmissionType: '---',
  driveType: '---',
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
        registerOptions={carVinValidationRules}
        type="text"
      />
      <Select
        errorMessage={errors.fuelType?.message}
        label="Fuel Type"
        name="fuelType"
        options={fuelTypesMapping}
        register={register}
        registerOptions={getCarDatabaseEnumTypeValidationRules(
          fuelTypesMapping,
        )}
      />
      <Select
        errorMessage={errors.additionalFuelType?.message}
        label="Additional Fuel Type"
        name="additionalFuelType"
        options={fuelTypesMapping}
        register={register}
        registerOptions={getCarDatabaseEnumTypeValidationRules(
          fuelTypesMapping,
        )}
      />
      <Select
        errorMessage={errors.transmissionType?.message}
        label="Transmission Type"
        name="transmissionType"
        options={transmissionTypesMapping}
        register={register}
        registerOptions={getCarDatabaseEnumTypeValidationRules(
          transmissionTypesMapping,
        )}
      />
      <Select
        errorMessage={errors.driveType?.message}
        label="Drive Type"
        name="driveType"
        options={driveTypesMapping}
        register={register}
        registerOptions={getCarDatabaseEnumTypeValidationRules(
          driveTypesMapping,
        )}
      />
    </form>
  );
}
