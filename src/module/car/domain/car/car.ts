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

/**
 * Raw shape shared by every editable field, whether the caller is creating a
 * Car (every field present, absent nullable fields meaning "no value") or
 * patching one (a present field is applied, an absent one is left alone).
 */
type EditableFieldRawValue = {
  customName?: string;
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

export type CarCreateParams = EditableFieldRawValue & {
  id: string;
  customName: string;
};

export type CarEditParams = EditableFieldRawValue;

/**
 * One factory per editable field, the single place each field's raw wire
 * value is turned into its value object. `create` (every field resolved,
 * including to `null`) and `edit` (only present fields resolved) each decide
 * which fields to call these with; the validation itself lives here once.
 */
const editableFieldFactories: {
  [K in keyof CarEditableValue]: (
    value: EditableFieldRawValue[K],
  ) => Result<CarEditableValue[K], ValidatorError>;
} = {
  customName: (value) => CustomName.create(value as string),
  brand: (value) => optionalValueObject(Brand.create, value),
  model: (value) => optionalValueObject(Model.create, value),
  licensePlates: (value) => optionalValueObject(LicensePlates.create, value),
  vin: (value) => optionalValueObject(Vin.create, value),
  fuelType: (value) => optionalValueObject(FuelType.create, value),
  additionalFuelType: (value) =>
    optionalValueObject(AdditionalFuelType.create, value),
  transmissionType: (value) =>
    optionalValueObject(TransmissionType.create, value),
  driveType: (value) => optionalValueObject(DriveType.create, value),
  productionYear: (value) => optionalValueObject(ProductionYear.create, value),
  engineCapacity: (value) => optionalValueObject(EngineCapacity.create, value),
  mileage: (value) => optionalValueObject(Mileage.create, value),
  insuranceExpiration: (value) =>
    optionalValueObject(InsuranceExpiration.create, value),
  technicalInspectionExpiration: (value) =>
    optionalValueObject(TechnicalInspectionExpiration.create, value),
  imageUrl: (value) => optionalValueObject(ImageUrl.create, value),
};

export class Car extends Entity<CarValue> {
  private constructor(value: CarValue) {
    super(value);
  }

  /**
   * Resolves `keys` atomically via `editableFieldFactories`, failing on the
   * first invalid field in `keys` order. `create` passes every key (a new
   * Car has no prior state, so every field must resolve to something,
   * including `null`); `edit` passes only the keys present in its params, so
   * an absent field is never resolved (not even to `null`) and is left
   * untouched.
   *
   * `Result.combine` infers its precise per-field return type from an object
   * literal with a fixed key set; here the key set is only known at runtime
   * (`keys`), so the combined result is cast back to the shape its keys are
   * actually drawn from.
   */
  private static resolveFields<K extends keyof CarEditableValue>(
    params: EditableFieldRawValue,
    keys: readonly K[],
  ): Result<Pick<CarEditableValue, K>, ValidatorError> {
    const resolved: Record<string, Result<unknown, ValidatorError>> = {};

    for (const key of keys) {
      resolved[key] = editableFieldFactories[key](params[key] as never);
    }

    return Result.combine(resolved) as Result<
      Pick<CarEditableValue, K>,
      ValidatorError
    >;
  }

  private static readonly editableFieldNames = Object.keys(
    editableFieldFactories,
  ) as (keyof CarEditableValue)[];

  /**
   * Single factory for both a brand-new Car (add passes a generated id) and
   * reconstitution from persistence (mapper passes the stored id).
   */
  static create(params: CarCreateParams): Result<Car, ValidatorError> {
    const idResult = CarId.create(params.id);
    if (!idResult.success) {
      return Result.fail(idResult.error);
    }

    const editableResult = Car.resolveFields(params, Car.editableFieldNames);
    if (!editableResult.success) {
      return Result.fail(editableResult.error);
    }

    return Result.ok(new Car({ id: idResult.data, ...editableResult.data }));
  }

  /**
   * Partial patch: a field absent from `params`, or explicitly `undefined`,
   * is left untouched, so a caller that only cares about one field (e.g.
   * attaching an uploaded Image right after creation) never has to resupply
   * the rest. Every present field is validated before any mutation, so an
   * invalid field leaves the Car untouched. A present nullable field of
   * `null` clears it; only `null` clears, an empty string is validated (and
   * rejected) like any other value.
   */
  edit(params: CarEditParams): Result<undefined, ValidatorError> {
    const presentFields = Car.editableFieldNames.filter(
      (key) => Object.hasOwn(params, key) && params[key] !== undefined,
    );

    const patchResult = Car.resolveFields(params, presentFields);
    if (!patchResult.success) {
      return Result.fail(patchResult.error);
    }

    Object.assign(this._value, patchResult.data);

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
