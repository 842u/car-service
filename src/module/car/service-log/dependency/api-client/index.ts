import { NextServiceLogApiClient } from '@/car/service-log/infrastructure/api-client/next-service-log';
import { httpClient } from '@/dependency/http-client';
import { validator } from '@/dependency/validator';

export const serviceLogApiClient = new NextServiceLogApiClient(
  httpClient,
  validator,
);
