import type {
  AddOwnerApiRequest,
  AddOwnerApiResponseData,
  AddOwnerApiResponseError,
} from '@/car/ownership/interface/api/add.schema';
import type {
  PromotePrimaryOwnerApiRequest,
  PromotePrimaryOwnerApiResponseData,
  PromotePrimaryOwnerApiResponseError,
} from '@/car/ownership/interface/api/promote.schema';
import type {
  RemoveOwnerApiRequest,
  RemoveOwnerApiResponseData,
  RemoveOwnerApiResponseError,
} from '@/car/ownership/interface/api/remove.schema';
import { NextApiHandler } from '@/common/infrastructure/api-handler/next';
import { validator } from '@/dependency/validator';

export const addOwnerApiHandler = new NextApiHandler<
  AddOwnerApiResponseData,
  AddOwnerApiResponseError,
  AddOwnerApiRequest
>(validator);

export const removeOwnerApiHandler = new NextApiHandler<
  RemoveOwnerApiResponseData,
  RemoveOwnerApiResponseError,
  RemoveOwnerApiRequest
>(validator);

export const promotePrimaryOwnerApiHandler = new NextApiHandler<
  PromotePrimaryOwnerApiResponseData,
  PromotePrimaryOwnerApiResponseError,
  PromotePrimaryOwnerApiRequest
>(validator);
