import type {
  AddOwnerApiRequest,
  AddOwnerApiResponseData,
  AddOwnerApiResponseError,
} from '@/car/ownership/interface/api/add.schema';
import { NextApiHandler } from '@/common/infrastructure/api-handler/next';
import { validator } from '@/dependency/validator';

export const addOwnerApiHandler = new NextApiHandler<
  AddOwnerApiResponseData,
  AddOwnerApiResponseError,
  AddOwnerApiRequest
>(validator);
