import { httpClient } from '@/dependencies/http-client';
import { validator } from '@/dependencies/validator';
import { NextUserApiClient } from '@/user/infrastructure/api-client/next-user-api-client';

export const userApiClient = new NextUserApiClient(httpClient, validator);
