import { CarId } from '@/car/domain/car/value-object/car-id/car-id';
import { AuthorId } from '@/car/service-log/domain/service-log/value-object/author-id/author-id';
import { ServiceCategories } from '@/car/service-log/domain/service-log/value-object/service-categories/service-categories';
import { ServiceCost } from '@/car/service-log/domain/service-log/value-object/service-cost/service-cost';
import { ServiceDate } from '@/car/service-log/domain/service-log/value-object/service-date/service-date';
import { ServiceLogId } from '@/car/service-log/domain/service-log/value-object/service-log-id/service-log-id';
import { ServiceMileage } from '@/car/service-log/domain/service-log/value-object/service-mileage/service-mileage';
import { ServiceNote } from '@/car/service-log/domain/service-log/value-object/service-note/service-note';
import { Result } from '@/common/application/result';
import type { ValidatorError } from '@/common/application/validator';
import { Entity } from '@/common/domain/entity';
import { optionalValueObject } from '@/common/domain/value-object';

type ServiceLogValue = {
  id: ServiceLogId;
  carId: CarId;
  authorId: AuthorId;
  serviceDate: ServiceDate;
  categories: ServiceCategories;
  mileage: ServiceMileage | null;
  note: ServiceNote | null;
  serviceCost: ServiceCost | null;
};

export type ServiceLogCreateParams = {
  id: string;
  carId: string;
  authorId: string;
  serviceDate: string;
  categories: string[];
  mileage?: number | null;
  note?: string | null;
  serviceCost?: number | null;
};

export class ServiceLog extends Entity<ServiceLogValue> {
  private constructor(value: ServiceLogValue) {
    super(value);
  }

  /**
   * Single factory for both a brand-new Service Log (the use case passes a
   * generated id) and reconstitution from persistence (the mapper passes the
   * stored id). `createdAt` is database-managed and deliberately not part of
   * this aggregate.
   */
  static create(
    params: ServiceLogCreateParams,
  ): Result<ServiceLog, ValidatorError> {
    const combinedResult = Result.combine({
      id: ServiceLogId.create(params.id),
      carId: CarId.create(params.carId),
      authorId: AuthorId.create(params.authorId),
      serviceDate: ServiceDate.create(params.serviceDate),
      categories: ServiceCategories.create(params.categories),
      mileage: optionalValueObject(ServiceMileage.create, params.mileage),
      note: optionalValueObject(ServiceNote.create, params.note),
      serviceCost: optionalValueObject(ServiceCost.create, params.serviceCost),
    });

    if (!combinedResult.success) {
      return Result.fail(combinedResult.error);
    }

    return Result.ok(new ServiceLog(combinedResult.data));
  }

  isAuthoredBy(userId: string): boolean {
    return this._value.authorId.value === userId;
  }

  get id(): ServiceLogId {
    return this._value.id;
  }

  get carId(): CarId {
    return this._value.carId;
  }

  get authorId(): AuthorId {
    return this._value.authorId;
  }

  get serviceDate(): ServiceDate {
    return this._value.serviceDate;
  }

  get categories(): ServiceCategories {
    return this._value.categories;
  }

  get mileage(): ServiceMileage | null {
    return this._value.mileage;
  }

  get note(): ServiceNote | null {
    return this._value.note;
  }

  get serviceCost(): ServiceCost | null {
    return this._value.serviceCost;
  }
}
