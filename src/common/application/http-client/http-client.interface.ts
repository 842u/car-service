import type { Result } from '@/common/application/result/result';

type ResultMeta = {
  status: number;
  statusText: string;
  headers: Record<string, string>;
};

export type HttpClientResponse<T = unknown> = Result<T, HttpError, ResultMeta>;

export interface RequestController {
  cancel(): void;
  isCancelled(): boolean;
  readonly reason?: string;
}

export interface RequestConfig<T extends RequestController> {
  headers?: Record<string, string>;
  timeout?: number;
  baseUrl?: string;
  requestController?: T;
}

export interface HttpClient {
  get(
    url: string,
    config?: RequestConfig<RequestController>,
  ): Promise<HttpClientResponse>;

  post(
    url: string,
    data?: unknown,
    config?: RequestConfig<RequestController>,
  ): Promise<HttpClientResponse>;

  put(
    url: string,
    data?: unknown,
    config?: RequestConfig<RequestController>,
  ): Promise<HttpClientResponse>;

  delete(
    url: string,
    data?: unknown,
    config?: RequestConfig<RequestController>,
  ): Promise<HttpClientResponse>;

  patch(
    url: string,
    data?: unknown,
    config?: RequestConfig<RequestController>,
  ): Promise<HttpClientResponse>;

  getController(): RequestController;
}

export class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export class RequestCancelledError extends HttpError {
  constructor(reason?: string) {
    super(`Request cancelled: ${reason || ''}`, 0);
    this.name = 'RequestCancelledError';
  }
}

export class ResponseParseError extends HttpError {
  constructor(reason?: string) {
    super(`Response parse failed: ${reason || ''}`, 0);
    this.name = 'ResponseParseError';
  }
}
