import type {
  AddServiceLogApiRequest,
  AddServiceLogApiResponseData,
  AddServiceLogApiResponseError,
} from '@/car/service-log/interface/api/add.schema';
import { NextApiHandler } from '@/common/infrastructure/api-handler/next';
import { validator } from '@/dependency/validator';

export const addServiceLogApiHandler = new NextApiHandler<
  AddServiceLogApiResponseData,
  AddServiceLogApiResponseError,
  AddServiceLogApiRequest
>(validator);
