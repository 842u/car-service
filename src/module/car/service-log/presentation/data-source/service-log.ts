import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import type { Result } from '@/common/application/result';

type ServiceLogDataSourceError = {
  message: string;
};

export interface ServiceLogDataSource {
  getByCarId(
    carId: string,
  ): Promise<Result<ServiceLogDto[], ServiceLogDataSourceError>>;
}
