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
