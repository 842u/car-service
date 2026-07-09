import type { CarDto } from '@/car/application/dto/car';
import type { CarPersistence } from '@/car/application/persistence-model/car';
import { Car } from '@/car/domain/car/car';
import type { Mapper } from '@/common/application/mapper';
import { Result } from '@/common/application/result';

export class CarMapper implements Mapper<Car, CarDto, CarPersistence> {
  domainToDto(model: Car): CarDto {
    return {
      id: model.id.value,
      imageUrl: model.imageUrl?.value,
      customName: model.customName.value,
      brand: model.brand?.value,
      model: model.model?.value,
      licensePlates: model.licensePlates?.value,
      vin: model.vin?.value,
      fuelType: model.fuelType?.value,
      additionalFuelType: model.additionalFuelType?.value,
      transmissionType: model.transmissionType?.value,
      driveType: model.driveType?.value,
      productionYear: model.productionYear?.value,
      engineCapacity: model.engineCapacity?.value,
      mileage: model.mileage?.value,
      insuranceExpiration: model.insuranceExpiration?.value,
      technicalInspectionExpiration: model.technicalInspectionExpiration?.value,
    };
  }

  domainToPersistence(model: Car): CarPersistence {
    // created_at / created_by are database-managed; omitted so an update never
    // overwrites them.
    return {
      id: model.id.value,
      image_url: model.imageUrl?.value ?? null,
      custom_name: model.customName.value,
      brand: model.brand?.value ?? null,
      model: model.model?.value ?? null,
      license_plates: model.licensePlates?.value ?? null,
      vin: model.vin?.value ?? null,
      fuel_type: model.fuelType?.value ?? null,
      additional_fuel_type: model.additionalFuelType?.value ?? null,
      transmission_type: model.transmissionType?.value ?? null,
      drive_type: model.driveType?.value ?? null,
      production_year: model.productionYear?.value ?? null,
      engine_capacity: model.engineCapacity?.value ?? null,
      mileage: model.mileage?.value ?? null,
      insurance_expiration: model.insuranceExpiration?.value ?? null,
      technical_inspection_expiration:
        model.technicalInspectionExpiration?.value ?? null,
    } as CarPersistence;
  }

  persistenceToDomain(model: CarPersistence) {
    const carResult = Car.create({
      id: model.id,
      imageUrl: model.image_url,
      customName: model.custom_name,
      brand: model.brand,
      model: model.model,
      licensePlates: model.license_plates,
      vin: model.vin,
      fuelType: model.fuel_type,
      additionalFuelType: model.additional_fuel_type,
      transmissionType: model.transmission_type,
      driveType: model.drive_type,
      productionYear: model.production_year,
      engineCapacity: model.engine_capacity,
      mileage: model.mileage,
      insuranceExpiration: model.insurance_expiration,
      technicalInspectionExpiration: model.technical_inspection_expiration,
    });

    if (!carResult.success) {
      return Result.fail(carResult.error);
    }

    return Result.ok(carResult.data);
  }

  persistenceToDto(model: CarPersistence): CarDto {
    return {
      id: model.id,
      imageUrl: model.image_url,
      customName: model.custom_name,
      brand: model.brand,
      model: model.model,
      licensePlates: model.license_plates,
      vin: model.vin,
      fuelType: model.fuel_type,
      additionalFuelType: model.additional_fuel_type,
      transmissionType: model.transmission_type,
      driveType: model.drive_type,
      productionYear: model.production_year,
      engineCapacity: model.engine_capacity,
      mileage: model.mileage,
      insuranceExpiration: model.insurance_expiration,
      technicalInspectionExpiration: model.technical_inspection_expiration,
      createdAt: model.created_at,
    };
  }
}
