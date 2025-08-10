export interface RequestController {
  cancel(): void;
  isCancelled(): boolean;
  readonly reason?: string;
}

export interface HttpClient {
  get<T>(
    url: string,
    config?: RequestConfig<RequestController>,
  ): Promise<HttpResponse<T>>;

  post<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig<RequestController>,
  ): Promise<HttpResponse<T>>;

  put<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig<RequestController>,
  ): Promise<HttpResponse<T>>;

  delete<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig<RequestController>,
  ): Promise<HttpResponse<T>>;

  getController(): RequestController;
}

export interface RequestConfig<T extends RequestController> {
  headers?: Record<string, string>;
  timeout?: number;
  baseUrl?: string;
  requestController?: T;
}

export interface HttpResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
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
