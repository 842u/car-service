import type {
  HttpClient,
  HttpClientResponse,
  RequestConfig,
  RequestController,
} from '@/common/application/http-client/http-client';
import {
  HttpError,
  RequestCancelledError,
} from '@/common/application/http-client/http-client';
import { Result } from '@/common/application/result/result';

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

  async get(url: string, config?: FetchRequestConfig) {
    return this.request('GET', url, undefined, config);
  }

  async post(url: string, data?: string, config?: FetchRequestConfig) {
    return this.request('POST', url, data, config);
  }

  async put(url: string, data?: string, config?: FetchRequestConfig) {
    return this.request('PUT', url, data, config);
  }

  async delete(url: string, config?: FetchRequestConfig) {
    return this.request('DELETE', url, undefined, config);
  }

  async patch(url: string, data?: string, config?: FetchRequestConfig) {
    return this.request('PATCH', url, data, config);
  }

  private async request(
    method: string,
    url: string,
    data?: string,
    config?: FetchRequestConfig,
  ): Promise<HttpClientResponse> {
    const timeout = config?.timeout || this.defaultTimeout;
    let controller = config?.requestController;
    let timeoutId: NodeJS.Timeout | undefined;

    if (timeout) {
      if (!controller) {
        controller = new FetchRequestController();
      }

      timeoutId = setTimeout(() => {
        controller!.cancel('Request timeout.');
      }, timeout);
    }

    const fullUrl = this.buildUrl(url, config?.baseUrl);
    const headers = this.buildHeaders(config?.headers);

    try {
      const response = await fetch(fullUrl, {
        method,
        headers,
        body: data,
        signal: controller?.signal,
      });

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const responseParseResult = await this.safeParseResponse(response);

      if (!responseParseResult.success) {
        const { error } = responseParseResult;

        return Result.fail(new HttpError(error, 0));
      }

      const responseData = responseParseResult.data;

      return Result.ok(responseData, {
        headers: this.parseHeaders(response.headers),
        status: response.status,
        statusText: response.statusText,
      });
    } catch (error) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (error instanceof DOMException && error.name === 'AbortError') {
        const reason = controller?.reason || 'Request cancelled.';
        return Result.fail(new RequestCancelledError(reason));
      }

      return Result.fail(new HttpError('Unexpected error.', 0, error));
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
        return Result.fail('Failed to parse response JSON.');
      }
    }

    try {
      const data = (await response.text()) as T;
      return Result.ok(data);
    } catch {
      return Result.fail('Failed to parse response text.');
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
