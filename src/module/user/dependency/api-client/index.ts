import { httpClient } from '@/dependency/http-client';
import { validator } from '@/dependency/validator';
import { NextUserApiClient } from '@/user/infrastructure/api-client/next-user';

export const userApiClient = new NextUserApiClient(httpClient, validator);
