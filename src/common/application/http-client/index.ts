import type { FailureResult, SuccessResult } from '@/common/application/result';

export type HttpResponseMeta = {
  status: number;
  statusText: string;
  headers: Record<string, string>;
};

/**
 * Why a request produced no usable response. A status is deliberately absent:
 * any response that arrives is a success, whatever its status, and the caller
 * reads the body to decide what it means.
 */
export type HttpClientErrorKind = 'network' | 'timeout' | 'aborted' | 'parse';

export type HttpClientError = {
  kind: HttpClientErrorKind;
  message: string;
  cause?: unknown;
};

export const httpClientError = {
  network(message: string, cause?: unknown): HttpClientError {
    return { kind: 'network', message, cause };
  },

  timeout(message: string, cause?: unknown): HttpClientError {
    return { kind: 'timeout', message, cause };
  },

  aborted(message: string, cause?: unknown): HttpClientError {
    return { kind: 'aborted', message, cause };
  },

  parse(message: string, cause?: unknown): HttpClientError {
    return { kind: 'parse', message, cause };
  },
};

type HttpClientSuccessResponse<TData> = SuccessResult<TData, HttpResponseMeta>;

type HttpClientFailureResponse = FailureResult<HttpClientError>;

/**
 * Metadata sits on the success branch alone, because it exists only when a
 * response arrived. Reading a status off a failure is a type error.
 */
export type HttpClientResponse<TData = unknown> =
  HttpClientSuccessResponse<TData> | HttpClientFailureResponse;

export type RequestConfig = {
  headers?: HeadersInit;
  timeout?: number;
  baseUrl?: string;
  signal?: AbortSignal;
};

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface HttpClient {
  /**
   * The verb methods below are sugar over this one. A caller holding the verb
   * in a variable calls it directly rather than switching over the verb to
   * pick a method.
   */
  request(
    method: HttpMethod,
    url: string,
    body?: BodyInit,
    config?: RequestConfig,
  ): Promise<HttpClientResponse>;

  get(url: string, config?: RequestConfig): Promise<HttpClientResponse>;

  post(
    url: string,
    body?: BodyInit,
    config?: RequestConfig,
  ): Promise<HttpClientResponse>;

  put(
    url: string,
    body?: BodyInit,
    config?: RequestConfig,
  ): Promise<HttpClientResponse>;

  delete(
    url: string,
    body?: BodyInit,
    config?: RequestConfig,
  ): Promise<HttpClientResponse>;

  patch(
    url: string,
    body?: BodyInit,
    config?: RequestConfig,
  ): Promise<HttpClientResponse>;
}
