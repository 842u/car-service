import type { ApplicationError, ErrorKind } from '@/common/application/error';
import type { ValidatorIssue } from '@/common/application/validator';

type ApiError = { message: string; issues?: ValidatorIssue[] };

const kindToStatus: Record<ErrorKind, number> = {
  validation: 422,
  unauthorized: 401,
  forbidden: 403,
  'not-found': 404,
  conflict: 409,
  unexpected: 500,
};

export const httpErrorMapper = {
  toApiError(error: ApplicationError): { error: ApiError; status: number } {
    const { kind, message, issues } = error;

    return { error: { message, issues }, status: kindToStatus[kind] };
  },
};
