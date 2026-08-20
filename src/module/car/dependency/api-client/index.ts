import { NextCarApiClient } from '@/car/infrastructure/api-client/next-car';
import { apiRequester } from '@/dependency/api-requester';

export const carApiClient = new NextCarApiClient(apiRequester);
