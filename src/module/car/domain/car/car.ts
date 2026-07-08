import { AdditionalFuelType } from '@/car/domain/car/value-object/additional-fuel-type/additional-fuel-type';
import { Brand } from '@/car/domain/car/value-object/brand/brand';
import { CarId } from '@/car/domain/car/value-object/car-id/car-id';
import { CustomName } from '@/car/domain/car/value-object/custom-name/custom-name';
import { DriveType } from '@/car/domain/car/value-object/drive-type/drive-type';
import { EngineCapacity } from '@/car/domain/car/value-object/engine-capacity/engine-capacity';
import { FuelType } from '@/car/domain/car/value-object/fuel-type/fuel-type';
import { ImageUrl } from '@/car/domain/car/value-object/image-url/image-url';
import { InsuranceExpiration } from '@/car/domain/car/value-object/insurance-expiration/insurance-expiration';
import { LicensePlates } from '@/car/domain/car/value-object/license-plates/license-plates';
import { Mileage } from '@/car/domain/car/value-object/mileage/mileage';
import { Model } from '@/car/domain/car/value-object/model/model';
import { ProductionYear } from '@/car/domain/car/value-object/production-year/production-year';
import { TechnicalInspectionExpiration } from '@/car/domain/car/value-object/technical-inspection-expiration/technical-inspection-expiration';
import { TransmissionType } from '@/car/domain/car/value-object/transmission-type/transmission-type';
import { Vin } from '@/car/domain/car/value-object/vin/vin';
import { Result } from '@/common/application/result';
import type { ValidatorError } from '@/common/application/validator';
import { Entity } from '@/common/domain/entity';

type CarEditableValue = {
  customName: CustomName;
  brand: Brand | null;
  model: Model | null;
  licensePlates: LicensePlates | null;
  vin: Vin | null;
  fuelType: FuelType | null;
  additionalFuelType: AdditionalFuelType | null;
  transmissionType: TransmissionType | null;
  driveType: DriveType | null;
  productionYear: ProductionYear | null;
  engineCapacity: EngineCapacity | null;
  mileage: Mileage | null;
  insuranceExpiration: InsuranceExpiration | null;
  technicalInspectionExpiration: TechnicalInspectionExpiration | null;
};

type CarValue = CarEditableValue & {
  id: CarId;
  imageUrl: ImageUrl | null;
};

export type CarEditParams = {
  customName: string;
  brand?: string | null;
  model?: string | null;
  licensePlates?: string | null;
  vin?: string | null;
  fuelType?: string | null;
  additionalFuelType?: string | null;
  transmissionType?: string | null;
  driveType?: string | null;
  productionYear?: number | null;
  engineCapacity?: number | null;
  mileage?: number | null;
  insuranceExpiration?: string | null;
  technicalInspectionExpiration?: string | null;
};

export type CarCreateParams = CarEditParams & {
  id: string;
  imageUrl?: string | null;
};

// Runs a value object factory only when a value is present; absent (null /
// undefined) nullable fields resolve to `null` without validation.
function optionalValueObject<Input, Vo>(
  create: (value: Input) => Result<Vo, ValidatorError>,
  value: Input | null | undefined,
): Result<Vo | null, ValidatorError> {
  if (value === null || value === undefined) {
    return Result.ok(null);
  }

  return create(value);
}

export class Car extends Entity<CarValue> {
  private constructor(value: CarValue) {
    super(value);
  }

  // Constructs and validates the 14 editable value objects atomically, failing
  // on the first invalid field. Shared by `create` and `edit`.
  private static buildEditable(
    params: CarEditParams,
  ): Result<CarEditableValue, ValidatorError> {
    const customNameResult = CustomName.create(params.customName);
    if (!customNameResult.success) {
      return Result.fail(customNameResult.error);
    }

    const brandResult = optionalValueObject(Brand.create, params.brand);
    if (!brandResult.success) {
      return Result.fail(brandResult.error);
    }

    const modelResult = optionalValueObject(Model.create, params.model);
    if (!modelResult.success) {
      return Result.fail(modelResult.error);
    }

    const licensePlatesResult = optionalValueObject(
      LicensePlates.create,
      params.licensePlates,
    );
    if (!licensePlatesResult.success) {
      return Result.fail(licensePlatesResult.error);
    }

    const vinResult = optionalValueObject(Vin.create, params.vin);
    if (!vinResult.success) {
      return Result.fail(vinResult.error);
    }

    const fuelTypeResult = optionalValueObject(
      FuelType.create,
      params.fuelType,
    );
    if (!fuelTypeResult.success) {
      return Result.fail(fuelTypeResult.error);
    }

    const additionalFuelTypeResult = optionalValueObject(
      AdditionalFuelType.create,
      params.additionalFuelType,
    );
    if (!additionalFuelTypeResult.success) {
      return Result.fail(additionalFuelTypeResult.error);
    }

    const transmissionTypeResult = optionalValueObject(
      TransmissionType.create,
      params.transmissionType,
    );
    if (!transmissionTypeResult.success) {
      return Result.fail(transmissionTypeResult.error);
    }

    const driveTypeResult = optionalValueObject(
      DriveType.create,
      params.driveType,
    );
    if (!driveTypeResult.success) {
      return Result.fail(driveTypeResult.error);
    }

    const productionYearResult = optionalValueObject(
      ProductionYear.create,
      params.productionYear,
    );
    if (!productionYearResult.success) {
      return Result.fail(productionYearResult.error);
    }

    const engineCapacityResult = optionalValueObject(
      EngineCapacity.create,
      params.engineCapacity,
    );
    if (!engineCapacityResult.success) {
      return Result.fail(engineCapacityResult.error);
    }

    const mileageResult = optionalValueObject(Mileage.create, params.mileage);
    if (!mileageResult.success) {
      return Result.fail(mileageResult.error);
    }

    const insuranceExpirationResult = optionalValueObject(
      InsuranceExpiration.create,
      params.insuranceExpiration,
    );
    if (!insuranceExpirationResult.success) {
      return Result.fail(insuranceExpirationResult.error);
    }

    const technicalInspectionExpirationResult = optionalValueObject(
      TechnicalInspectionExpiration.create,
      params.technicalInspectionExpiration,
    );
    if (!technicalInspectionExpirationResult.success) {
      return Result.fail(technicalInspectionExpirationResult.error);
    }

    return Result.ok({
      customName: customNameResult.data,
      brand: brandResult.data,
      model: modelResult.data,
      licensePlates: licensePlatesResult.data,
      vin: vinResult.data,
      fuelType: fuelTypeResult.data,
      additionalFuelType: additionalFuelTypeResult.data,
      transmissionType: transmissionTypeResult.data,
      driveType: driveTypeResult.data,
      productionYear: productionYearResult.data,
      engineCapacity: engineCapacityResult.data,
      mileage: mileageResult.data,
      insuranceExpiration: insuranceExpirationResult.data,
      technicalInspectionExpiration: technicalInspectionExpirationResult.data,
    });
  }

  // Single factory for both a brand-new Car (add passes a generated id) and
  // reconstitution from persistence (mapper passes the stored id).
  static create(params: CarCreateParams): Result<Car, ValidatorError> {
    const idResult = CarId.create(params.id);
    if (!idResult.success) {
      return Result.fail(idResult.error);
    }

    const editableResult = Car.buildEditable(params);
    if (!editableResult.success) {
      return Result.fail(editableResult.error);
    }

    let imageUrl: ImageUrl | null = null;
    if (params.imageUrl) {
      const imageUrlResult = ImageUrl.create(params.imageUrl);
      if (!imageUrlResult.success) {
        return Result.fail(imageUrlResult.error);
      }
      imageUrl = imageUrlResult.data;
    }

    return Result.ok(
      new Car({ id: idResult.data, imageUrl, ...editableResult.data }),
    );
  }

  // Atomic edit of all 14 editable fields; leaves `id` and `imageUrl` untouched.
  edit(params: CarEditParams): Result<undefined, ValidatorError> {
    const editableResult = Car.buildEditable(params);
    if (!editableResult.success) {
      return Result.fail(editableResult.error);
    }

    Object.assign(this._value, editableResult.data);

    return Result.ok(undefined);
  }

  changeImageUrl(imageUrl: string | undefined | null) {
    if (!imageUrl) {
      this._value.imageUrl = null;

      return Result.ok(undefined);
    }

    const imageUrlResult = ImageUrl.create(imageUrl);

    if (!imageUrlResult.success) {
      return Result.fail(imageUrlResult.error);
    }

    this._value.imageUrl = imageUrlResult.data;

    return Result.ok(undefined);
  }

  get id(): CarId {
    return this._value.id;
  }

  get customName(): CustomName {
    return this._value.customName;
  }

  get brand(): Brand | null {
    return this._value.brand;
  }

  get model(): Model | null {
    return this._value.model;
  }

  get licensePlates(): LicensePlates | null {
    return this._value.licensePlates;
  }

  get vin(): Vin | null {
    return this._value.vin;
  }

  get fuelType(): FuelType | null {
    return this._value.fuelType;
  }

  get additionalFuelType(): AdditionalFuelType | null {
    return this._value.additionalFuelType;
  }

  get transmissionType(): TransmissionType | null {
    return this._value.transmissionType;
  }

  get driveType(): DriveType | null {
    return this._value.driveType;
  }

  get productionYear(): ProductionYear | null {
    return this._value.productionYear;
  }

  get engineCapacity(): EngineCapacity | null {
    return this._value.engineCapacity;
  }

  get mileage(): Mileage | null {
    return this._value.mileage;
  }

  get insuranceExpiration(): InsuranceExpiration | null {
    return this._value.insuranceExpiration;
  }

  get technicalInspectionExpiration(): TechnicalInspectionExpiration | null {
    return this._value.technicalInspectionExpiration;
  }

  get imageUrl(): ImageUrl | null {
    return this._value.imageUrl;
  }
}
