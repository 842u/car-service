import { JsonApiRequester } from '@/common/infrastructure/api-requester/json';
import { httpClient } from '@/dependency/http-client';
import { validator } from '@/dependency/validator';

export const apiRequester = new JsonApiRequester(httpClient, validator);
