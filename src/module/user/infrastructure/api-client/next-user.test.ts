import type { HttpClient } from '@/common/application/http-client';
import { HttpError } from '@/common/application/http-client';
import { createMockHttpClient } from '@/common/application/http-client.mock';
import { Result } from '@/common/application/result';
import type { Validator } from '@/common/application/validator';
import { ValidatorError } from '@/common/application/validator';
import { createMockValidator } from '@/common/application/validator.mock';
import { buildUserDto } from '@/user/application/dto/user.builder';
import { editUserApiResponseSchema } from '@/user/interface/api/edit.schema';
import { passwordChangeApiResponseSchema } from '@/user/interface/api/password-change.schema';
import { signInApiResponseSchema } from '@/user/interface/api/sign-in.schema';
import { signUpApiResponseSchema } from '@/user/interface/api/sign-up.schema';

import { NextUserApiClient } from './next-user';

describe('NextUserApiClient', () => {
  let mockHttpClient: jest.Mocked<HttpClient>;
  let mockValidator: jest.Mocked<Validator>;
  let userApiClient: NextUserApiClient;

  beforeEach(() => {
    mockHttpClient = createMockHttpClient();
    mockValidator = createMockValidator();
    userApiClient = new NextUserApiClient(mockHttpClient, mockValidator);
  });

  describe('signUp', () => {
    const contract = { email: 'test@example.com', password: 'Password1!' };
    const userDto = buildUserDto();

    it('should call httpClient.post with correct endpoint and serialized contract', async () => {
      mockHttpClient.post.mockResolvedValue(
        Result.ok(
          { success: true, data: userDto },
          {
            status: 200,
            statusText: 'OK',
            headers: {},
          },
        ),
      );
      mockValidator.validate.mockReturnValue(
        Result.ok({ success: true, data: userDto }),
      );

      await userApiClient.signUp(contract);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/auth/sign-up',
        JSON.stringify(contract),
      );
      expect(mockValidator.validate).toHaveBeenCalledWith(
        { success: true, data: userDto },
        signUpApiResponseSchema,
      );
    });

    it('should fail when HTTP request fails', async () => {
      mockHttpClient.post.mockResolvedValue(
        Result.fail(new HttpError('Network error', 500), {
          status: 500,
          statusText: 'Internal Server Error',
          headers: {},
        }),
      );

      const result = await userApiClient.signUp(contract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('HTTP request failed: Network error');
      }
    });

    it('should fail when response validation fails', async () => {
      mockHttpClient.post.mockResolvedValue(
        Result.ok('invalid-data', {
          status: 200,
          statusText: 'OK',
          headers: {},
        }),
      );
      mockValidator.validate.mockReturnValue(
        Result.fail(new ValidatorError('Invalid shape')),
      );

      const result = await userApiClient.signUp(contract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(
          'API response validation failed: Invalid shape',
        );
      }
    });

    it('should fail when API response indicates failure', async () => {
      const apiError = {
        success: false,
        error: { message: 'Email already taken' },
      };

      mockHttpClient.post.mockResolvedValue(
        Result.ok(apiError, {
          status: 200,
          statusText: 'OK',
          headers: {},
        }),
      );
      mockValidator.validate.mockReturnValue(Result.ok(apiError));

      const result = await userApiClient.signUp(contract);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Email already taken');
      }
    });

    it('should return data on success', async () => {
      const apiSuccess = { success: true, data: userDto };

      mockHttpClient.post.mockResolvedValue(
        Result.ok(apiSuccess, {
          status: 200,
          statusText: 'OK',
          headers: {},
        }),
      );
      mockValidator.validate.mockReturnValue(Result.ok(apiSuccess));

      const result = await userApiClient.signUp(contract);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(userDto);
      }
    });
  });

  describe('signIn', () => {
    const contract = { email: 'test@example.com', password: 'Password1!' };
    const userDto = buildUserDto();

    it('should call httpClient.post with /api/auth/sign-in', async () => {
      const apiSuccess = { success: true, data: userDto };

      mockHttpClient.post.mockResolvedValue(
        Result.ok(apiSuccess, { status: 200, statusText: 'OK', headers: {} }),
      );
      mockValidator.validate.mockReturnValue(Result.ok(apiSuccess));

      await userApiClient.signIn(contract);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/auth/sign-in',
        JSON.stringify(contract),
      );
      expect(mockValidator.validate).toHaveBeenCalledWith(
        apiSuccess,
        signInApiResponseSchema,
      );
    });

    it('should return data on success', async () => {
      const apiSuccess = { success: true, data: userDto };

      mockHttpClient.post.mockResolvedValue(
        Result.ok(apiSuccess, { status: 200, statusText: 'OK', headers: {} }),
      );
      mockValidator.validate.mockReturnValue(Result.ok(apiSuccess));

      const result = await userApiClient.signIn(contract);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(userDto);
      }
    });
  });

  describe('passwordChange', () => {
    const contract = {
      password: 'newPassword123',
      passwordConfirm: 'newPassword123',
    };
    const userDto = buildUserDto();

    it('should call httpClient.patch with /api/auth/password-change', async () => {
      const apiSuccess = { success: true, data: userDto };

      mockHttpClient.patch.mockResolvedValue(
        Result.ok(apiSuccess, { status: 200, statusText: 'OK', headers: {} }),
      );
      mockValidator.validate.mockReturnValue(Result.ok(apiSuccess));

      await userApiClient.passwordChange(contract);

      expect(mockHttpClient.patch).toHaveBeenCalledWith(
        '/api/auth/password-change',
        JSON.stringify(contract),
      );
      expect(mockValidator.validate).toHaveBeenCalledWith(
        apiSuccess,
        passwordChangeApiResponseSchema,
      );
    });

    it('should return data on success', async () => {
      const apiSuccess = { success: true, data: userDto };

      mockHttpClient.patch.mockResolvedValue(
        Result.ok(apiSuccess, { status: 200, statusText: 'OK', headers: {} }),
      );
      mockValidator.validate.mockReturnValue(Result.ok(apiSuccess));

      const result = await userApiClient.passwordChange(contract);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(userDto);
      }
    });
  });

  describe('edit', () => {
    const contract = { name: 'New Name' };
    const userDto = buildUserDto({ name: 'New Name' });

    it('should call httpClient.patch with /api/user', async () => {
      const apiSuccess = { success: true, data: userDto };

      mockHttpClient.patch.mockResolvedValue(
        Result.ok(apiSuccess, { status: 200, statusText: 'OK', headers: {} }),
      );
      mockValidator.validate.mockReturnValue(Result.ok(apiSuccess));

      await userApiClient.edit(contract);

      expect(mockHttpClient.patch).toHaveBeenCalledWith(
        '/api/user',
        JSON.stringify(contract),
      );
      expect(mockValidator.validate).toHaveBeenCalledWith(
        apiSuccess,
        editUserApiResponseSchema,
      );
    });

    it('should return data on success', async () => {
      const apiSuccess = { success: true, data: userDto };

      mockHttpClient.patch.mockResolvedValue(
        Result.ok(apiSuccess, { status: 200, statusText: 'OK', headers: {} }),
      );
      mockValidator.validate.mockReturnValue(Result.ok(apiSuccess));

      const result = await userApiClient.edit(contract);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(userDto);
      }
    });
  });
});
