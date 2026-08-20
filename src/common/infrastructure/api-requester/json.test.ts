import type { ApiResponseBody } from '@/common/application/api-response';
import type { HttpClient } from '@/common/application/http-client';
import { httpClientError } from '@/common/application/http-client';
import { createMockHttpClient } from '@/common/application/http-client.mock';
import { Result } from '@/common/application/result';
import type { Validator } from '@/common/application/validator';
import { ValidatorError } from '@/common/application/validator';
import { createMockValidator } from '@/common/application/validator.mock';

import { JsonApiRequester } from './json';

const schema = {} as { _output: ApiResponseBody<unknown> };

function httpSuccess(data: unknown, status = 200) {
  return Result.ok(data, { status, statusText: 'OK', headers: {} });
}

describe('JsonApiRequester', () => {
  let mockHttpClient: jest.Mocked<HttpClient>;
  let mockValidator: jest.Mocked<Validator>;
  let apiRequester: JsonApiRequester;

  beforeEach(() => {
    mockHttpClient = createMockHttpClient();
    mockValidator = createMockValidator();
    apiRequester = new JsonApiRequester(mockHttpClient, mockValidator);
  });

  describe('dispatch', () => {
    it.each([
      ['POST', 'post'],
      ['PATCH', 'patch'],
      ['DELETE', 'delete'],
    ] as const)(
      'should send %s through the matching client method',
      async (method, clientMethod) => {
        const body = { success: true, data: null };

        mockHttpClient[clientMethod].mockResolvedValue(httpSuccess(body));
        mockValidator.validate.mockReturnValue(Result.ok(body));

        await apiRequester.send(method, '/api/car', { carId: '1' }, schema);

        expect(mockHttpClient[clientMethod]).toHaveBeenCalledWith(
          '/api/car',
          JSON.stringify({ carId: '1' }),
          { headers: { 'Content-Type': 'application/json' } },
        );
      },
    );

    it('should validate the response body against the given schema', async () => {
      const body = { success: true, data: null };

      mockHttpClient.post.mockResolvedValue(httpSuccess(body));
      mockValidator.validate.mockReturnValue(Result.ok(body));

      await apiRequester.send('POST', '/api/car', {}, schema);

      expect(mockValidator.validate).toHaveBeenCalledWith(body, schema);
    });
  });

  describe('transport failure', () => {
    it('should fail without validating the response', async () => {
      mockHttpClient.post.mockResolvedValue(
        Result.fail(httpClientError.network('Network error')),
      );

      const result = await apiRequester.send('POST', '/api/car', {}, schema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('HTTP request failed: Network error');
      }
      expect(mockValidator.validate).not.toHaveBeenCalled();
    });
  });

  describe('non-envelope body', () => {
    it('should fail with a message naming the status', async () => {
      mockHttpClient.post.mockResolvedValue(
        httpSuccess('<!doctype html>', 404),
      );
      mockValidator.validate.mockReturnValue(
        Result.fail(new ValidatorError('Invalid shape')),
      );

      const result = await apiRequester.send('POST', '/api/car', {}, schema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(
          'API response validation failed with status 404: Invalid shape',
        );
      }
    });
  });

  describe('envelope reporting failure', () => {
    it('should fail with the envelope message', async () => {
      const body = {
        success: false,
        status: 409,
        error: { message: 'Email already taken' },
      };

      mockHttpClient.post.mockResolvedValue(httpSuccess(body, 409));
      mockValidator.validate.mockReturnValue(Result.ok(body));

      const result = await apiRequester.send('POST', '/api/car', {}, schema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Email already taken');
      }
    });

    it('should carry validation issues through untouched', async () => {
      const issues = [{ path: ['vin'], message: 'Invalid VIN.' }];
      const body = {
        success: false,
        status: 422,
        error: { message: 'Validation failed.', issues },
      };

      mockHttpClient.post.mockResolvedValue(httpSuccess(body, 422));
      mockValidator.validate.mockReturnValue(Result.ok(body));

      const result = await apiRequester.send('POST', '/api/car', {}, schema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toEqual(issues);
      }
    });
  });

  describe('envelope reporting success', () => {
    it('should return the envelope data', async () => {
      const data = { id: '1' };
      const body = { success: true, status: 200, data };

      mockHttpClient.post.mockResolvedValue(httpSuccess(body));
      mockValidator.validate.mockReturnValue(Result.ok(body));

      const result = await apiRequester.send('POST', '/api/car', {}, schema);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(data);
      }
    });
  });
});
