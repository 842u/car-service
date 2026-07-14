import type {
  AddServiceLogApiRequest,
  AddServiceLogApiResponseData,
  AddServiceLogApiResponseError,
} from '@/car/service-log/interface/api/add.schema';
import type {
  EditServiceLogApiRequest,
  EditServiceLogApiResponseData,
  EditServiceLogApiResponseError,
} from '@/car/service-log/interface/api/edit.schema';
import type {
  RemoveServiceLogApiRequest,
  RemoveServiceLogApiResponseData,
  RemoveServiceLogApiResponseError,
} from '@/car/service-log/interface/api/remove.schema';
import { NextApiHandler } from '@/common/infrastructure/api-handler/next';
import { validator } from '@/dependency/validator';

export const addServiceLogApiHandler = new NextApiHandler<
  AddServiceLogApiResponseData,
  AddServiceLogApiResponseError,
  AddServiceLogApiRequest
>(validator);

export const editServiceLogApiHandler = new NextApiHandler<
  EditServiceLogApiResponseData,
  EditServiceLogApiResponseError,
  EditServiceLogApiRequest
>(validator);

export const removeServiceLogApiHandler = new NextApiHandler<
  RemoveServiceLogApiResponseData,
  RemoveServiceLogApiResponseError,
  RemoveServiceLogApiRequest
>(validator);
