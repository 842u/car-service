import { NextOwnershipApiClient } from '@/car/ownership/infrastructure/api-client/next-ownership';
import { httpClient } from '@/dependency/http-client';
import { validator } from '@/dependency/validator';

export const ownershipApiClient = new NextOwnershipApiClient(
  httpClient,
  validator,
);
