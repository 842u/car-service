import { apiRequester } from '@/dependency/api-requester';
import { NextUserApiClient } from '@/user/infrastructure/api-client/next-user';

export const userApiClient = new NextUserApiClient(apiRequester);
