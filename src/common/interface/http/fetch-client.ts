import { Result } from '../result';
import type {
  HttpClient,
  HttpResponse,
  RequestConfig,
  RequestController,
} from './client.interface';
import {
  HttpError,
  RequestCancelledError,
  ResponseParseError,
} from './client.interface';

class FetchRequestController implements RequestController {
  private abortController: AbortController;
  private _reason?: string;

  constructor() {
    this.abortController = new AbortController();
  }

  cancel(reason?: string) {
    this._reason = reason;
    this.abortController.abort();
  }

  isCancelled() {
    return this.abortController.signal.aborted;
  }

  get reason() {
    return this._reason;
  }

  get signal() {
    return this.abortController.signal;
  }
}

type FetchRequestConfig = RequestConfig<FetchRequestController>;

export class FetchHttpClient implements HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout?: number;

  constructor(config: FetchRequestConfig = {}) {
    this.baseUrl = config.baseUrl || '';
    this.defaultHeaders = config.headers || {};
    this.defaultTimeout = config.timeout;
  }

  getController(): FetchRequestController {
    return new FetchRequestController();
  }

  async get<T>(url: string, config?: FetchRequestConfig) {
    return this.request<T>('GET', url, undefined, config);
  }

  async post<T>(url: string, data?: unknown, config?: FetchRequestConfig) {
    return this.request<T>('POST', url, data, config);
  }

  async put<T>(url: string, data?: unknown, config?: FetchRequestConfig) {
    return this.request<T>('PUT', url, data, config);
  }

  async delete<T>(url: string, config?: FetchRequestConfig) {
    return this.request<T>('DELETE', url, undefined, config);
  }

  private async request<T>(
    method: string,
    url: string,
    data?: unknown,
    config?: FetchRequestConfig,
  ): Promise<HttpResponse<T>> {
    const timeout = config?.timeout || this.defaultTimeout;

    let controller = config?.requestController;

    let timeoutId: NodeJS.Timeout | undefined;

    if (timeout) {
      const timeoutController = new FetchRequestController();

      timeoutId = setTimeout(() => {
        timeoutController.cancel('Request timeout.');
      }, timeout);

      controller = timeoutController;
    }

    const fullUrl = this.buildUrl(url, config?.baseUrl);

    const headers = this.buildHeaders(config?.headers);
    const body = JSON.stringify(data);

    try {
      const response = await fetch(fullUrl, {
        method,
        headers,
        body,
        signal: controller?.signal,
      });

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const responseParseResult = await this.safeParseResponse<T>(response);

      if (!responseParseResult.success) {
        const error = responseParseResult.error;

        throw new ResponseParseError(error);
      }

      const responseData = responseParseResult.data;

      if (!response.ok) {
        throw new HttpError(
          `HTTP Error: ${response.status} ${response.statusText}`,
          response.status,
          responseData,
        );
      }

      return {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: this.parseHeaders(response.headers),
      };
    } catch (error) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (error instanceof HttpError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === 'AbortError') {
        const reason = controller?.reason || 'Request cancelled.';
        throw new RequestCancelledError(reason);
      }

      throw new HttpError('Network error', 0, error);
    }
  }

  private buildUrl(url: string, configBaseUrl?: string) {
    const baseUrl = configBaseUrl || this.baseUrl;

    if (!baseUrl) return url;

    // Match "/" at the end of a string
    const baseUrlRegEx = /\/$/;
    // Match "/" at the beginning of a string
    const urlRegEx = /^\//;

    return `${baseUrl.replace(baseUrlRegEx, '')}/${url.replace(urlRegEx, '')}`;
  }

  private buildHeaders(configHeaders?: Record<string, string>) {
    return {
      'Content-Type': 'application/json',
      ...this.defaultHeaders,
      ...configHeaders,
    };
  }

  private async safeParseResponse<T>(
    response: Response,
  ): Promise<Result<T, string>> {
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      try {
        const data = await response.json();
        return Result.ok(data);
      } catch {
        return Result.fail('Failed to parse JSON.');
      }
    }

    try {
      const data = (await response.text()) as T;
      return Result.ok(data);
    } catch {
      return Result.fail('Failed to parse text');
    }
  }

  private parseHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};

    headers.forEach((value, key) => {
      result[key] = value;
    });

    return result;
  }
}
