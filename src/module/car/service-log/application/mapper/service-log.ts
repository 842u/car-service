import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import type { ServiceLogPersistence } from '@/car/service-log/application/persistence-model/service-log';
import { ServiceLog } from '@/car/service-log/domain/service-log/service-log';
import type { Mapper } from '@/common/application/mapper';
import { Result } from '@/common/application/result';

export class ServiceLogMapper implements Mapper<
  ServiceLog,
  ServiceLogDto,
  ServiceLogPersistence
> {
  domainToDto(model: ServiceLog): ServiceLogDto {
    return {
      id: model.id.value,
      carId: model.carId.value,
      authorId: model.authorId.value,
      serviceDate: model.serviceDate.value,
      categories: model.categories.value,
      mileage: model.mileage?.value,
      notes: model.note?.value,
      serviceCost: model.serviceCost?.value,
      createdAt: null,
    };
  }

  // `created_at` is database-managed and omitted so an update never
  // overwrites it.
  domainToPersistence(model: ServiceLog): ServiceLogPersistence {
    return {
      id: model.id.value,
      car_id: model.carId.value,
      created_by: model.authorId.value,
      service_date: model.serviceDate.value,
      category: model.categories.value,
      mileage: model.mileage?.value ?? null,
      notes: model.note?.value ?? null,
      service_cost: model.serviceCost?.value ?? null,
    } as ServiceLogPersistence;
  }

  persistenceToDomain(row: ServiceLogPersistence) {
    const serviceLogResult = ServiceLog.create({
      id: row.id,
      carId: row.car_id,
      authorId: row.created_by,
      serviceDate: row.service_date,
      categories: row.category,
      mileage: row.mileage,
      note: row.notes,
      serviceCost: row.service_cost,
    });

    if (!serviceLogResult.success) {
      return Result.fail(serviceLogResult.error);
    }

    return Result.ok(serviceLogResult.data);
  }

  persistenceToDto(row: ServiceLogPersistence): ServiceLogDto {
    return {
      id: row.id,
      carId: row.car_id,
      authorId: row.created_by,
      serviceDate: row.service_date,
      categories: row.category,
      mileage: row.mileage,
      notes: row.notes,
      serviceCost: row.service_cost,
      createdAt: row.created_at,
    };
  }
}
