import { NextCarApiClient } from '@/car/infrastructure/api-client/next-car';
import { httpClient } from '@/dependency/http-client';
import { validator } from '@/dependency/validator';

export const carApiClient = new NextCarApiClient(httpClient, validator);
