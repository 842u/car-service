import { NextOwnershipApiClient } from '@/car/ownership/infrastructure/api-client/next-ownership';
import { apiRequester } from '@/dependency/api-requester';

export const ownershipApiClient = new NextOwnershipApiClient(apiRequester);
