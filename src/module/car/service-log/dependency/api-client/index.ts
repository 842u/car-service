import { NextServiceLogApiClient } from '@/car/service-log/infrastructure/api-client/next-service-log';
import { apiRequester } from '@/dependency/api-requester';

export const serviceLogApiClient = new NextServiceLogApiClient(apiRequester);
