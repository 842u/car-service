import type { Result } from '@/common/application/result/result';

type ResultMeta = {
  status: number;
  statusText: string;
  headers: Record<string, string>;
};

export type ResponseResult<T, E> = Result<T, E, ResultMeta>;

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
  ): Promise<ResponseResult<unknown, unknown>>;

  post(
    url: string,
    data?: unknown,
    config?: RequestConfig<RequestController>,
  ): Promise<ResponseResult<unknown, unknown>>;

  put(
    url: string,
    data?: unknown,
    config?: RequestConfig<RequestController>,
  ): Promise<ResponseResult<unknown, unknown>>;

  delete(
    url: string,
    data?: unknown,
    config?: RequestConfig<RequestController>,
  ): Promise<ResponseResult<unknown, unknown>>;

  patch(
    url: string,
    data?: unknown,
    config?: RequestConfig<RequestController>,
  ): Promise<ResponseResult<unknown, unknown>>;

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
