import type { OwnershipDomainError } from '@/car/ownership/domain/ownership/ownership';
import {
  type ApplicationError,
  applicationError,
} from '@/common/application/error';

export function ownershipDomainErrorToApplicationError(
  error: OwnershipDomainError,
): ApplicationError {
  switch (error.kind) {
    case 'validation':
      return applicationError.validation(error.message, error.issues);
    case 'forbidden':
      return applicationError.forbidden(error.message);
    case 'conflict':
      return applicationError.conflict(error.message);
  }
}
