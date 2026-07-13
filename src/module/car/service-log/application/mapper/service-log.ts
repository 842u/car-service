import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import type { ServiceLogPersistence } from '@/car/service-log/application/persistence-model/service-log';

/**
 * Not yet declared as `implements Mapper<...>`: the domain aggregate this
 * mapper will eventually convert to/from doesn't exist yet, so the other
 * three directions can't be typed. This class picks up the full `Mapper`
 * interface once the domain aggregate lands.
 */
export class ServiceLogMapper {
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
