import type {
  AddCarApiRequest,
  AddCarApiResponseData,
  AddCarApiResponseError,
} from '@/car/interface/api/add.schema';
import type {
  EditCarApiRequest,
  EditCarApiResponseData,
  EditCarApiResponseError,
} from '@/car/interface/api/edit.schema';
import type {
  CarImageChangeApiRequest,
  CarImageChangeApiResponseData,
  CarImageChangeApiResponseError,
} from '@/car/interface/api/image-change.schema';
import type {
  RemoveCarApiRequest,
  RemoveCarApiResponseData,
  RemoveCarApiResponseError,
} from '@/car/interface/api/remove.schema';
import { NextApiHandler } from '@/common/infrastructure/api-handler/next';
import { validator } from '@/dependency/validator';

export const addCarApiHandler = new NextApiHandler<
  AddCarApiResponseData,
  AddCarApiResponseError,
  AddCarApiRequest
>(validator);

export const editCarApiHandler = new NextApiHandler<
  EditCarApiResponseData,
  EditCarApiResponseError,
  EditCarApiRequest
>(validator);

export const removeCarApiHandler = new NextApiHandler<
  RemoveCarApiResponseData,
  RemoveCarApiResponseError,
  RemoveCarApiRequest
>(validator);

export const carImageChangeApiHandler = new NextApiHandler<
  CarImageChangeApiResponseData,
  CarImageChangeApiResponseError,
  CarImageChangeApiRequest
>(validator);
