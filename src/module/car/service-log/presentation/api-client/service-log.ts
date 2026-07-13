import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import type { AddServiceLogApiRequest } from '@/car/service-log/interface/api/add.schema';
import type { Result } from '@/common/application/result';

type ServiceLogApiClientError = { message: string };

export interface ServiceLogApiClient {
  add(
    contract: AddServiceLogApiRequest,
  ): Promise<Result<ServiceLogDto, ServiceLogApiClientError>>;
}
