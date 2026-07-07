import type { ValidatorIssue } from '@/common/application/validator';

export type ErrorKind =
  | 'validation'
  | 'unauthorized'
  | 'not-found'
  | 'conflict'
  | 'unexpected';

export type ApplicationError = {
  kind: ErrorKind;
  message: string;
  issues?: ValidatorIssue[];
};

export const applicationError = {
  validation(message: string, issues?: ValidatorIssue[]): ApplicationError {
    return { kind: 'validation', message, issues };
  },

  unauthorized(message: string): ApplicationError {
    return { kind: 'unauthorized', message };
  },

  notFound(message: string): ApplicationError {
    return { kind: 'not-found', message };
  },

  conflict(message: string): ApplicationError {
    return { kind: 'conflict', message };
  },

  unexpected(message: string): ApplicationError {
    return { kind: 'unexpected', message };
  },
};
