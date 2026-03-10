import { NextRequest, NextResponse } from 'next/server';

import type { ApiHandlerResponseError } from '@/common/application/api-handler';
import type { Validator } from '@/common/application/validator';

import { NextApiHandler } from './next';

jest.mock('next/server', () => ({
  NextRequest: jest.fn((request) => request),
  NextResponse: {
    json: jest.fn((body, init) => ({
      body,
      status: init?.status,
      json: async () => body,
    })),
    redirect: jest.fn((url, init) => ({
      url,
      status: init?.status,
    })),
  },
}));

describe('NextApiHandler', () => {
  let mockValidator: jest.Mocked<Validator>;
  let apiHandler: NextApiHandler<unknown, ApiHandlerResponseError, unknown>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockValidator = {
      validate: jest.fn(),
    };

    apiHandler = new NextApiHandler(mockValidator);
  });

  describe('preprocessRequest', () => {
    const mockSchema = { _output: {} };
    const mockApiUrl = 'http://localhost:3000/api/test';

    it('should fail when Content-Type is not application/json', async () => {
      const request = new NextRequest(
        new Request(mockApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
        }),
      );

      const result = await apiHandler.preprocessRequest(request, mockSchema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(
          "Invalid content type. Expected 'application/json'.",
        );
        expect(result.status).toBe(415);
      }
    });

    it('should fail when JSON format is invalid', async () => {
      const requestBody = 'invalid json{';
      const request = new NextRequest(
        new Request(mockApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: requestBody,
        }),
      );

      const result = await apiHandler.preprocessRequest(request, mockSchema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Invalid JSON format.');
        expect(result.status).toBe(400);
      }
    });

    it('should fail when validation fails', async () => {
      const requestBody = { name: 'test' };
      const request = new NextRequest(
        new Request(mockApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        }),
      );

      mockValidator.validate.mockReturnValue({
        success: false,
        error: {
          name: 'ValidationError',
          message: 'Validation failed',
          issues: [{ path: ['name'], message: 'Validation issue message.' }],
        },
      });

      const result = await apiHandler.preprocessRequest(request, mockSchema);

      expect(mockValidator.validate).toHaveBeenCalledWith(
        requestBody,
        mockSchema,
        'Contract validation failed.',
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.status).toBe(422);
      }
    });

    it('should use custom error message when provided', async () => {
      const requestBody = { name: 'test' };
      const errorMessage = 'Custom error message.';
      const request = new NextRequest(
        new Request(mockApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        }),
      );

      mockValidator.validate.mockReturnValue({
        success: false,
        error: {
          name: 'ValidationError',
          message: errorMessage,
          issues: [{ path: ['name'], message: 'Validation issue message.' }],
        },
      });

      const result = await apiHandler.preprocessRequest(
        request,
        mockSchema,
        errorMessage,
      );

      expect(mockValidator.validate).toHaveBeenCalledWith(
        requestBody,
        mockSchema,
        errorMessage,
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.status).toBe(422);
        expect(result.error.message).toBe(errorMessage);
      }
    });

    it('should succeed when validation passes', async () => {
      const requestBody = { name: 'test', age: 11 };
      const request = new NextRequest(
        new Request(mockApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        }),
      );

      mockValidator.validate.mockReturnValue({
        success: true,
        data: requestBody,
      });

      const result = await apiHandler.preprocessRequest(request, mockSchema);

      expect(mockValidator.validate).toHaveBeenCalledWith(
        requestBody,
        mockSchema,
        'Contract validation failed.',
      );
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(requestBody);
      }
    });
  });

  describe('errorResponse', () => {
    it('should create error response with correct structure', () => {
      const error = { message: 'Something went wrong' };
      const status = 400;
      const responseBody = {
        success: false,
        error,
        status,
      };

      const response = apiHandler.errorResponse(error, status);

      expect(NextResponse.json).toHaveBeenCalledWith(responseBody, { status });
      expect(response.status).toBe(status);
      expect(response.body).toEqual(responseBody);
    });
  });

  describe('successResponse', () => {
    it('should create success response with correct structure', () => {
      const data = { name: 'test', age: 11 };
      const status = 200;
      const responseBody = {
        success: true,
        data,
        status,
      };

      const response = apiHandler.successResponse(data, status);

      expect(NextResponse.json).toHaveBeenCalledWith(responseBody, { status });
      expect(response.status).toBe(status);
      expect(response.body).toEqual(responseBody);
    });
  });

  describe('redirectResponse', () => {
    it('should create redirect response to provided URL', () => {
      const url = 'https://test.com/';
      const status = 302;

      const response = apiHandler.redirectResponse(url, status);

      expect(NextResponse.redirect).toHaveBeenCalledWith(url, { status });
      expect(response.status).toBe(status);
      expect(response.url).toBe(url);
    });
  });
});
