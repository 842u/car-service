import { httpClient } from '@/dependencies/http-client';
import { validator } from '@/dependencies/validator';
import { NextUserApiClient } from '@/user/infrastructure/api-client/next-user';

export const userApiClient = new NextUserApiClient(httpClient, validator);
