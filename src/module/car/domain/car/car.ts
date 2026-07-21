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
import { optionalValueObject } from '@/common/domain/value-object';

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
  imageUrl: ImageUrl | null;
};

type CarValue = CarEditableValue & {
  id: CarId;
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
  imageUrl?: string | null;
};

export type CarCreateParams = CarEditParams & {
  id: string;
};

export class Car extends Entity<CarValue> {
  private constructor(value: CarValue) {
    super(value);
  }

  /**
   * Constructs and validates the 15 editable value objects atomically, failing
   * on the first invalid field in declaration order. Shared by `create` and
   * `edit`.
   */
  private static buildEditable(
    params: CarEditParams,
  ): Result<CarEditableValue, ValidatorError> {
    return Result.combine({
      customName: CustomName.create(params.customName),
      brand: optionalValueObject(Brand.create, params.brand),
      model: optionalValueObject(Model.create, params.model),
      licensePlates: optionalValueObject(
        LicensePlates.create,
        params.licensePlates,
      ),
      vin: optionalValueObject(Vin.create, params.vin),
      fuelType: optionalValueObject(FuelType.create, params.fuelType),
      additionalFuelType: optionalValueObject(
        AdditionalFuelType.create,
        params.additionalFuelType,
      ),
      transmissionType: optionalValueObject(
        TransmissionType.create,
        params.transmissionType,
      ),
      driveType: optionalValueObject(DriveType.create, params.driveType),
      productionYear: optionalValueObject(
        ProductionYear.create,
        params.productionYear,
      ),
      engineCapacity: optionalValueObject(
        EngineCapacity.create,
        params.engineCapacity,
      ),
      mileage: optionalValueObject(Mileage.create, params.mileage),
      insuranceExpiration: optionalValueObject(
        InsuranceExpiration.create,
        params.insuranceExpiration,
      ),
      technicalInspectionExpiration: optionalValueObject(
        TechnicalInspectionExpiration.create,
        params.technicalInspectionExpiration,
      ),
      imageUrl: optionalValueObject(ImageUrl.create, params.imageUrl),
    });
  }

  /**
   * Single factory for both a brand-new Car (add passes a generated id) and
   * reconstitution from persistence (mapper passes the stored id).
   */
  static create(params: CarCreateParams): Result<Car, ValidatorError> {
    const idResult = CarId.create(params.id);
    if (!idResult.success) {
      return Result.fail(idResult.error);
    }

    const editableResult = Car.buildEditable(params);
    if (!editableResult.success) {
      return Result.fail(editableResult.error);
    }

    return Result.ok(new Car({ id: idResult.data, ...editableResult.data }));
  }

  /**
   * Atomic edit of all 15 editable fields, including the Image; leaves only
   * `id` untouched.
   */
  edit(params: CarEditParams): Result<undefined, ValidatorError> {
    const editableResult = Car.buildEditable(params);
    if (!editableResult.success) {
      return Result.fail(editableResult.error);
    }

    Object.assign(this._value, editableResult.data);

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
