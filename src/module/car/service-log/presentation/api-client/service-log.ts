import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import type { AddServiceLogApiRequest } from '@/car/service-log/interface/api/add.schema';
import type { EditServiceLogApiRequest } from '@/car/service-log/interface/api/edit.schema';
import type { Result } from '@/common/application/result';

type ServiceLogApiClientError = { message: string };

export interface ServiceLogApiClient {
  add(
    contract: AddServiceLogApiRequest,
  ): Promise<Result<ServiceLogDto, ServiceLogApiClientError>>;
  edit(
    contract: EditServiceLogApiRequest,
  ): Promise<Result<ServiceLogDto, ServiceLogApiClientError>>;
  remove(serviceLogId: string): Promise<Result<null, ServiceLogApiClientError>>;
}
