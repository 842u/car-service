import { FetchHttpClient } from '@/common/infrastructure/http-client/fetch';

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    status: 200,
    statusText: 'OK',
    headers: { 'content-type': 'application/json' },
    ...init,
  });
}

describe('FetchHttpClient', () => {
  let fetchSpy: jest.SpyInstance<
    Promise<Response>,
    [input: RequestInfo | URL, init?: RequestInit]
  >;
  let httpClient: FetchHttpClient;

  beforeEach(() => {
    fetchSpy = jest.spyOn(globalThis, 'fetch');
    httpClient = new FetchHttpClient();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function lastCall() {
    const call = fetchSpy.mock.calls.at(-1);

    if (!call) throw new Error('fetch was not called.');

    return { url: call[0], init: call[1] ?? {} };
  }

  function lastHeaders() {
    return new Headers(lastCall().init.headers);
  }

  /** Rejects with the abort reason and never settles otherwise. */
  function stallUntilAborted() {
    fetchSpy.mockImplementation(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          const { signal } = init ?? {};

          if (!signal) return;
          if (signal.aborted) return reject(signal.reason);

          signal.addEventListener('abort', () => reject(signal.reason));
        }),
    );
  }

  describe('response metadata', () => {
    it('should return the parsed body with its status, status text, and headers', async () => {
      fetchSpy.mockResolvedValue(
        jsonResponse(
          { id: 1 },
          {
            status: 201,
            statusText: 'Created',
            headers: { 'content-type': 'application/json', etag: 'abc' },
          },
        ),
      );

      const result = await httpClient.get('/users');

      expect(result.success).toBe(true);
      if (!result.success) return;

      expect(result.data).toEqual({ id: 1 });
      expect(result.status).toBe(201);
      expect(result.statusText).toBe('Created');
      expect(result.headers).toEqual({
        'content-type': 'application/json',
        etag: 'abc',
      });
    });

    it('should treat a non-2xx envelope as a response that arrived', async () => {
      const envelope = {
        success: false,
        status: 422,
        error: { message: 'Validation failed.' },
      };

      fetchSpy.mockResolvedValue(
        jsonResponse(envelope, { status: 422, statusText: 'Unprocessable' }),
      );

      const result = await httpClient.post('/api/car', '{}');

      expect(result.success).toBe(true);
      if (!result.success) return;

      expect(result.data).toEqual(envelope);
      expect(result.status).toBe(422);
    });

    it('should return a non-2xx html body as text', async () => {
      fetchSpy.mockResolvedValue(
        new Response('<!doctype html><title>404</title>', {
          status: 404,
          statusText: 'Not Found',
          headers: { 'content-type': 'text/html' },
        }),
      );

      const result = await httpClient.get('/mistyped');

      expect(result.success).toBe(true);
      if (!result.success) return;

      expect(result.data).toBe('<!doctype html><title>404</title>');
      expect(result.status).toBe(404);
    });
  });

  describe('body parsing', () => {
    it('should parse an empty body as null', async () => {
      fetchSpy.mockResolvedValue(
        new Response(null, { status: 204, statusText: 'No Content' }),
      );

      const result = await httpClient.delete('/users/1');

      expect(result.success).toBe(true);
      if (!result.success) return;

      expect(result.data).toBeNull();
      expect(result.status).toBe(204);
    });

    it('should return text when the response declares no content type', async () => {
      const response = new Response('plain body', { status: 200 });
      response.headers.delete('content-type');

      fetchSpy.mockResolvedValue(response);

      const result = await httpClient.get('/users');

      expect(result.success).toBe(true);
      if (!result.success) return;

      expect(result.data).toBe('plain body');
    });

    it('should fail with a parse error when the json body is malformed', async () => {
      fetchSpy.mockResolvedValue(
        new Response('{ not json', {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }),
      );

      const result = await httpClient.get('/users');

      expect(result.success).toBe(false);
      if (result.success) return;

      expect(result.error.kind).toBe('parse');
      expect(result.error.cause).toBeInstanceOf(SyntaxError);
    });
  });

  describe('verbs', () => {
    it.each([
      ['post', 'POST'],
      ['put', 'PUT'],
      ['delete', 'DELETE'],
      ['patch', 'PATCH'],
    ] as const)('should send %s with its body', async (method, verb) => {
      const body = JSON.stringify({ name: 'New User' });

      fetchSpy.mockResolvedValue(jsonResponse({}));

      await httpClient[method]('/users', body);

      expect(lastCall().init).toEqual(
        expect.objectContaining({ method: verb, body }),
      );
    });

    it('should send get without a body', async () => {
      fetchSpy.mockResolvedValue(jsonResponse({}));

      await httpClient.get('/users');

      expect(lastCall().init.method).toBe('GET');
      expect(lastCall().init.body).toBeUndefined();
    });
  });

  describe('headers', () => {
    it('should set no content type of its own', async () => {
      fetchSpy.mockResolvedValue(jsonResponse({}));

      await httpClient.post('/users', '{}');

      expect(lastHeaders().get('content-type')).toBeNull();
      expect([...lastHeaders()]).toEqual([]);
    });

    it('should send the configured default headers', async () => {
      const client = new FetchHttpClient({
        headers: { Authorization: 'Bearer token' },
      });

      fetchSpy.mockResolvedValue(jsonResponse({}));

      await client.get('/users');

      expect(lastHeaders().get('Authorization')).toBe('Bearer token');
    });

    it('should let a request header override a default of the same name', async () => {
      const client = new FetchHttpClient({
        headers: { Authorization: 'Bearer default', Accept: 'text/plain' },
      });

      fetchSpy.mockResolvedValue(jsonResponse({}));

      await client.get('/users', {
        headers: { Authorization: 'Bearer request' },
      });

      expect(lastHeaders().get('Authorization')).toBe('Bearer request');
      expect(lastHeaders().get('Accept')).toBe('text/plain');
    });
  });

  describe('url building', () => {
    beforeEach(() => {
      fetchSpy.mockResolvedValue(jsonResponse({}));
    });

    it('should pass the url through untouched when no base url is configured', async () => {
      await httpClient.get('/api/car');

      expect(lastCall().url).toBe('/api/car');
    });

    it.each([
      ['https://api.example.com', '/users'],
      ['https://api.example.com', 'users'],
      ['https://api.example.com/', '/users'],
      ['https://api.example.com/', 'users'],
    ])('should resolve %s against %s', async (baseUrl, url) => {
      const client = new FetchHttpClient({ baseUrl });

      await client.get(url);

      expect(lastCall().url).toBe('https://api.example.com/users');
    });

    it('should prefer the request base url over the configured one', async () => {
      const client = new FetchHttpClient({
        baseUrl: 'https://api.example.com',
      });

      await client.get('/users', { baseUrl: 'https://other.example.com' });

      expect(lastCall().url).toBe('https://other.example.com/users');
    });

    it('should not append an absolute url to the base url', async () => {
      const client = new FetchHttpClient({
        baseUrl: 'https://api.example.com',
      });

      await client.get('https://other.example.com/users');

      expect(lastCall().url).toBe('https://other.example.com/users');
    });
  });

  describe('transport failure', () => {
    it('should fail with a network error carrying the cause', async () => {
      const cause = new TypeError('Failed to fetch');

      fetchSpy.mockRejectedValue(cause);

      const result = await httpClient.get('/users');

      expect(result.success).toBe(false);
      if (result.success) return;

      expect(result.error.kind).toBe('network');
      expect(result.error.cause).toBe(cause);
    });
  });

  describe('cancellation', () => {
    it('should send no signal when nothing can cancel the request', async () => {
      fetchSpy.mockResolvedValue(jsonResponse({}));

      await httpClient.get('/users');

      expect(lastCall().init.signal).toBeUndefined();
    });

    it('should fail as aborted when the caller cancels mid flight', async () => {
      const controller = new AbortController();

      stallUntilAborted();

      const resultPromise = httpClient.get('/users', {
        signal: controller.signal,
        timeout: 10_000,
      });

      controller.abort();

      const result = await resultPromise;

      expect(result.success).toBe(false);
      if (result.success) return;

      expect(result.error.kind).toBe('aborted');
    });

    it('should fail as aborted when the caller signal is already aborted', async () => {
      stallUntilAborted();

      const result = await httpClient.get('/users', {
        signal: AbortSignal.abort(),
      });

      expect(result.success).toBe(false);
      if (result.success) return;

      expect(result.error.kind).toBe('aborted');
    });

    it('should fail as timeout when the deadline expires', async () => {
      stallUntilAborted();

      const result = await httpClient.get('/users', { timeout: 10 });

      expect(result.success).toBe(false);
      if (result.success) return;

      expect(result.error.kind).toBe('timeout');
    });

    it('should apply the configured default timeout', async () => {
      const client = new FetchHttpClient({ timeout: 10 });

      stallUntilAborted();

      const result = await client.get('/users');

      expect(result.success).toBe(false);
      if (result.success) return;

      expect(result.error.kind).toBe('timeout');
    });

    it('should prefer the request timeout over the configured default', async () => {
      const client = new FetchHttpClient({ timeout: 10 });
      const controller = new AbortController();

      stallUntilAborted();

      const resultPromise = client.get('/users', {
        timeout: 10_000,
        signal: controller.signal,
      });

      // Outlives the 10ms default. Had that deadline been applied, the request
      // would already have failed as a timeout rather than as an abort.
      await new Promise((resolve) => setTimeout(resolve, 50));
      controller.abort();

      const result = await resultPromise;

      expect(result.success).toBe(false);
      if (result.success) return;

      expect(result.error.kind).toBe('aborted');
    });

    it('should fail as timeout when the deadline expires while the body is read', async () => {
      const response = jsonResponse({});

      jest.spyOn(response, 'text').mockImplementation(
        () =>
          new Promise((_resolve, reject) => {
            const signal = fetchSpy.mock.calls.at(-1)?.[1]?.signal;

            signal?.addEventListener('abort', () => reject(signal.reason));
          }),
      );
      fetchSpy.mockResolvedValue(response);

      const result = await httpClient.get('/users', { timeout: 10 });

      expect(result.success).toBe(false);
      if (result.success) return;

      expect(result.error.kind).toBe('timeout');
    });
  });
});
