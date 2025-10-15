import {
  HttpError,
  RequestCancelledError,
} from '@/common/application/http-client';
import {
  FetchHttpClient,
  FetchRequestController,
} from '@/common/infrastructure/http-client/fetch';

describe('FetchHttpClient', () => {
  let httpClient: FetchHttpClient;
  let mockInternalFetch: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockInternalFetch = jest.spyOn(window, 'fetch');
    httpClient = new FetchHttpClient();
  });

  describe('constructor', () => {
    it('should create client with custom base URL', () => {
      const baseUrl = 'https://api.example.com';
      const client = new FetchHttpClient({
        baseUrl,
      });

      expect(client['baseUrl']).toBe(baseUrl);
    });

    it('should create client with custom headers', () => {
      const headers = { Authorization: 'Bearer token' };
      const client = new FetchHttpClient({
        headers,
      });

      expect(client['defaultHeaders']).toEqual(headers);
    });

    it('should create client with custom timeout', () => {
      const timeout = 1000;
      const client = new FetchHttpClient({
        timeout,
      });

      expect(client['defaultTimeout']).toEqual(timeout);
    });
  });

  describe('getController', () => {
    it('should return a request controller', () => {
      const controller = httpClient.getController();

      expect(controller).toBeInstanceOf(FetchRequestController);
    });
  });

  describe('get', () => {
    it('should make successful GET request with JSON response', async () => {
      const mockResponseData = { id: 1, name: 'Test' };
      const status = 200;
      const statusText = 'OK';
      mockInternalFetch.mockResolvedValue({
        ok: true,
        status,
        statusText,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: jest.fn().mockResolvedValue(mockResponseData),
      });

      const result = await httpClient.get('/users');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockResponseData);
        expect(result.status).toBe(status);
        expect(result.statusText).toBe(statusText);
      }
      expect(mockInternalFetch).toHaveBeenCalledWith(
        '/users',
        expect.objectContaining({
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    });

    it('should make successful GET request with text response', async () => {
      const mockResponseData = 'text';
      const status = 200;
      const statusText = 'OK';
      mockInternalFetch.mockResolvedValue({
        ok: true,
        status,
        statusText,
        headers: new Headers({ 'content-type': 'text/plain' }),
        text: jest.fn().mockResolvedValue(mockResponseData),
      });

      const result = await httpClient.get('/users');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockResponseData);
        expect(result.status).toBe(status);
        expect(result.statusText).toBe(statusText);
      }
      expect(mockInternalFetch).toHaveBeenCalledWith(
        '/users',
        expect.objectContaining({
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    });

    it('should include custom headers in request', async () => {
      mockInternalFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: jest.fn().mockResolvedValue({}),
      });

      await httpClient.get('/users', {
        headers: { Authorization: 'Bearer token123' },
      });

      expect(mockInternalFetch).toHaveBeenCalledWith(
        '/users',
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer token123',
          },
        }),
      );
    });

    it('should use base URL when configured', async () => {
      const baseUrl = 'https://api.example.com';
      const endpointPath = '/users';
      const clientWithBaseUrl = new FetchHttpClient({
        baseUrl,
      });
      mockInternalFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: jest.fn().mockResolvedValue({}),
      });

      await clientWithBaseUrl.get(endpointPath);

      expect(mockInternalFetch).toHaveBeenCalledWith(
        baseUrl + endpointPath,
        expect.anything(),
      );
    });

    it('should override default base URL with config base URL', async () => {
      const baseUrlOverride = 'https://different-api.com';
      const endpointPath = '/users';
      const clientWithBaseUrl = new FetchHttpClient({
        baseUrl: 'https://api.example.com',
      });
      mockInternalFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: jest.fn().mockResolvedValue({}),
      });

      await clientWithBaseUrl.get('/users', {
        baseUrl: baseUrlOverride,
      });

      expect(mockInternalFetch).toHaveBeenCalledWith(
        baseUrlOverride + endpointPath,
        expect.anything(),
      );
    });

    it('should handle URL creation correctly', async () => {
      const urlPairs = [
        ['https://api.example.com/', '/users'],
        ['https://api.example.com/', 'users'],
        ['https://api.example.com', '/users'],
        ['https://api.example.com', 'users'],
      ];
      mockInternalFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: jest.fn().mockResolvedValue({}),
      });

      for (const pair of urlPairs) {
        const baseUrl = pair[0];
        const endpointPath = pair[1];
        const clientWithBaseUrl = new FetchHttpClient({
          baseUrl,
        });

        await clientWithBaseUrl.get(endpointPath);

        expect(mockInternalFetch).toHaveBeenCalledWith(
          'https://api.example.com/users',
          expect.anything(),
        );
      }
    });
  });

  describe('post', () => {
    it('should make successful POST request', async () => {
      const requestData = JSON.stringify({ name: 'New User' });
      const endpointPath = '/users';
      const mockResponseData = { id: 1, name: 'Test' };
      const status = 200;
      const statusText = 'OK';
      mockInternalFetch.mockResolvedValue({
        ok: true,
        status,
        statusText,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: jest.fn().mockResolvedValue(mockResponseData),
      });

      const result = await httpClient.post(endpointPath, requestData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockResponseData);
        expect(result.status).toBe(status);
        expect(result.statusText).toBe(statusText);
      }
      expect(mockInternalFetch).toHaveBeenCalledWith(
        endpointPath,
        expect.objectContaining({
          method: 'POST',
          body: requestData,
        }),
      );
    });
  });

  describe('put', () => {
    it('should make successful PUT request', async () => {
      const requestData = JSON.stringify({ name: 'New User' });
      const endpointPath = '/users';
      const mockResponseData = { id: 1, name: 'Test' };
      const status = 200;
      const statusText = 'OK';
      mockInternalFetch.mockResolvedValue({
        ok: true,
        status,
        statusText,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: jest.fn().mockResolvedValue(mockResponseData),
      });

      const result = await httpClient.put(endpointPath, requestData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockResponseData);
        expect(result.status).toBe(status);
        expect(result.statusText).toBe(statusText);
      }
      expect(mockInternalFetch).toHaveBeenCalledWith(
        endpointPath,
        expect.objectContaining({
          method: 'PUT',
          body: requestData,
        }),
      );
    });
  });

  describe('delete', () => {
    it('should make successful DELETE request', async () => {
      const endpointPath = '/users';
      const status = 200;
      const statusText = 'OK';
      mockInternalFetch.mockResolvedValue({
        ok: true,
        status,
        statusText,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: jest.fn().mockResolvedValue(''),
      });

      const result = await httpClient.delete(endpointPath);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.status).toBe(status);
        expect(result.statusText).toBe(statusText);
      }
      expect(mockInternalFetch).toHaveBeenCalledWith(
        endpointPath,
        expect.objectContaining({
          method: 'DELETE',
        }),
      );
    });
  });

  describe('patch', () => {
    it('should make successful PATCH request', async () => {
      const requestData = JSON.stringify({ name: 'New User' });
      const endpointPath = '/users';
      const mockResponseData = { id: 1, name: 'Test' };
      const status = 200;
      const statusText = 'OK';
      mockInternalFetch.mockResolvedValue({
        ok: true,
        status,
        statusText,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: jest.fn().mockResolvedValue(mockResponseData),
      });

      const result = await httpClient.patch(endpointPath, requestData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockResponseData);
        expect(result.status).toBe(status);
        expect(result.statusText).toBe(statusText);
      }
      expect(mockInternalFetch).toHaveBeenCalledWith(
        endpointPath,
        expect.objectContaining({
          method: 'PATCH',
          body: requestData,
        }),
      );
    });
  });

  describe('error handling', () => {
    it('should handle JSON parse error', async () => {
      mockInternalFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      });

      const result = await httpClient.get('/users');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(HttpError);
        expect(result.error.message).toBe('Failed to parse response JSON.');
      }
    });

    it('should handle text parse error', async () => {
      mockInternalFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'text/plain' }),
        text: jest.fn().mockRejectedValue(new Error('Invalid text')),
      });

      const result = await httpClient.get('/users');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(HttpError);
        expect(result.error.message).toBe('Failed to parse response text.');
      }
    });

    it('should handle unexpected errors', async () => {
      mockInternalFetch.mockRejectedValue(new Error());

      const result = await httpClient.get('/users');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(HttpError);
        expect(result.error.message).toBe('Unexpected error.');
      }
    });
  });

  describe('request cancellation', () => {
    it('should cancel request with controller', async () => {
      const controller = httpClient.getController();
      const reason = 'test cancelled';
      mockInternalFetch.mockImplementation(() => {
        controller.cancel(reason);
        return Promise.reject(new DOMException('Aborted', 'AbortError'));
      });

      const result = await httpClient.get('/users', {
        requestController: controller,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(RequestCancelledError);
        expect(result.error.message).toContain(reason);
      }
      expect(controller.isCancelled()).toBe(true);
      expect(controller.reason).toBe(reason);
    });
  });

  describe('timeout handling', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should timeout request when configured timeout is exceeded', async () => {
      const timeout = 100;
      const requestDuration = 200;
      const httpClient = new FetchHttpClient({ timeout });

      mockInternalFetch.mockImplementation(
        (_url, options) =>
          /**
           * Mock fetch is not respecting the AbortSignal. When the timeout
           * triggers and calls controller.cancel(), the fetch mock does not
           * reject with an AbortError. Mock implementation need to actually
           * handle the abort signal.
           */
          new Promise((resolve, reject) => {
            const signal = options?.signal as AbortSignal;

            if (signal) {
              signal.addEventListener('abort', () => {
                reject(new DOMException('Aborted', 'AbortError'));
              });
            }

            setTimeout(() => {
              resolve({
                ok: true,
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'content-type': 'application/json' }),
                json: jest.fn().mockResolvedValue({}),
              });
            }, requestDuration);
          }),
      );

      const resultPromise = httpClient.get('/users');

      jest.advanceTimersByTime(timeout);
      // Execute the timeout callback inside request() which triggers abort.
      jest.runOnlyPendingTimers();

      const result = await resultPromise;

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(RequestCancelledError);
        expect(result.error.message).toContain('Request timeout.');
      }
    });

    it('should use request-level timeout over default timeout', async () => {
      const defaultTimeout = 300;
      const overrideTimeout = 100;
      const requestDuration = 200;
      const httpClient = new FetchHttpClient({ timeout: defaultTimeout });

      mockInternalFetch.mockImplementation(
        (_url, options) =>
          new Promise((resolve, reject) => {
            const signal = options?.signal as AbortSignal;

            if (signal) {
              signal.addEventListener('abort', () => {
                reject(new DOMException('Aborted', 'AbortError'));
              });
            }

            setTimeout(() => {
              resolve({
                ok: true,
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'content-type': 'application/json' }),
                json: jest.fn().mockResolvedValue({}),
              });
            }, requestDuration);
          }),
      );

      const resultPromise = httpClient.get('/users', {
        timeout: overrideTimeout,
      });

      jest.advanceTimersByTime(overrideTimeout);
      jest.runOnlyPendingTimers();

      const result = await resultPromise;

      expect(result.success).toBe(false);
    });

    it('should clear timeout on successful request', async () => {
      const httpClient = new FetchHttpClient({ timeout: 5000 });
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      mockInternalFetch.mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: jest.fn().mockResolvedValue({}),
      });

      await httpClient.get('/users');

      expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    it('should clear timeout on failed request', async () => {
      const httpClient = new FetchHttpClient({ timeout: 5000 });
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      mockInternalFetch.mockRejectedValue(new Error('Network error'));

      await httpClient.get('/users');

      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });
});
