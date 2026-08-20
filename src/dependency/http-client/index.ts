import { FetchHttpClient } from '@/common/infrastructure/http-client/fetch';

/**
 * Generous for what goes through this client: one contract validation plus one
 * database round trip, carrying a small JSON envelope. File uploads bypass it
 * and go to storage directly, so no large transfer can be cut off by this.
 */
const REQUEST_TIMEOUT_MS = 15_000;

export const httpClient = new FetchHttpClient({ timeout: REQUEST_TIMEOUT_MS });
