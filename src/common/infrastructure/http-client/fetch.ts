import type {
  HttpClient,
  HttpClientError,
  HttpClientResponse,
  HttpMethod,
  RequestConfig,
} from '@/common/application/http-client';
import { httpClientError } from '@/common/application/http-client';
import { Result } from '@/common/application/result';

/**
 * A signal belongs to one request, so the client-wide defaults cannot carry one.
 */
type FetchHttpClientConfig = Omit<RequestConfig, 'signal'>;

export class FetchHttpClient implements HttpClient {
  private readonly _baseUrl?: string;
  private readonly _defaultHeaders?: HeadersInit;
  private readonly _defaultTimeout?: number;

  constructor(config: FetchHttpClientConfig = {}) {
    this._baseUrl = config.baseUrl;
    this._defaultHeaders = config.headers;
    this._defaultTimeout = config.timeout;
  }

  async request(
    method: HttpMethod,
    url: string,
    body?: BodyInit,
    config?: RequestConfig,
  ): Promise<HttpClientResponse> {
    const signal = this.buildSignal(
      config?.signal,
      config?.timeout ?? this._defaultTimeout,
    );

    let response: Response;

    try {
      response = await fetch(this.buildUrl(url, config?.baseUrl), {
        method,
        headers: this.buildHeaders(config?.headers),
        body,
        signal,
      });
    } catch (error) {
      if (signal?.aborted) return Result.fail(abortError(signal));

      return Result.fail(
        httpClientError.network('The request could not be sent.', error),
      );
    }

    try {
      const meta = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers),
      };

      // Reading the body is still covered by the signal, so a deadline that
      // expires between the headers and the last byte is a timeout, not a
      // malformed body.
      return Result.ok(await parseBody(response), meta);
    } catch (error) {
      if (signal?.aborted) return Result.fail(abortError(signal));

      return Result.fail(
        httpClientError.parse('The response body could not be read.', error),
      );
    }
  }

  async get(url: string, config?: RequestConfig) {
    return this.request('GET', url, undefined, config);
  }

  async post(url: string, body?: BodyInit, config?: RequestConfig) {
    return this.request('POST', url, body, config);
  }

  async put(url: string, body?: BodyInit, config?: RequestConfig) {
    return this.request('PUT', url, body, config);
  }

  async delete(url: string, body?: BodyInit, config?: RequestConfig) {
    return this.request('DELETE', url, body, config);
  }

  async patch(url: string, body?: BodyInit, config?: RequestConfig) {
    return this.request('PATCH', url, body, config);
  }

  /**
   * One signal covering both the caller's cancellation and the deadline. There
   * is no timer to clear, so no path through the request can leak one.
   */
  private buildSignal(callerSignal?: AbortSignal, timeout?: number) {
    const signals = [
      callerSignal,
      timeout === undefined ? undefined : AbortSignal.timeout(timeout),
    ].filter((signal) => signal !== undefined);

    if (signals.length === 0) return undefined;

    return AbortSignal.any(signals);
  }

  private buildUrl(url: string, configBaseUrl?: string) {
    const baseUrl = configBaseUrl ?? this._baseUrl;

    // A relative path with no base has nothing to resolve against, and an
    // absolute url resolves to itself rather than being appended to the base.
    if (!baseUrl) return url;

    return new URL(url, baseUrl).toString();
  }

  /**
   * No `Content-Type` of its own. Whoever built the body knows its type, and a
   * multipart boundary is the browser's to set.
   */
  private buildHeaders(configHeaders?: HeadersInit) {
    const headers = new Headers(this._defaultHeaders);

    new Headers(configHeaders).forEach((value, key) => headers.set(key, value));

    return headers;
  }
}

function abortError(signal: AbortSignal): HttpClientError {
  const { reason } = signal;

  // `AbortSignal.timeout` aborts with a `TimeoutError` and `AbortController`
  // with an `AbortError`, so the two are told apart by what aborted the request
  // rather than by matching a message.
  if (reason instanceof DOMException && reason.name === 'TimeoutError') {
    return httpClientError.timeout(
      'The request exceeded its deadline.',
      reason,
    );
  }

  return httpClientError.aborted('The request was cancelled.', reason);
}

async function parseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type');
  const text = await response.text();

  if (text === '') return null;

  if (contentType?.includes('application/json')) return JSON.parse(text);

  return text;
}
