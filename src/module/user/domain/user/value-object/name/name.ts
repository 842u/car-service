import { Result } from '@/common/application/result';
import { ValidatorError } from '@/common/application/validator';
import { ValueObject } from '@/common/domain/value-object';
import {
  nameSchema,
  nameValidator,
} from '@/user/domain/user/value-object/name/name.schema';

export class Name extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string) {
    const result = nameValidator.validate(
      value,
      nameSchema,
      'Name validation failed.',
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new Name(value));
  }

  static fromCandidates(candidates: string[]): Result<Name, ValidatorError> {
    let lastError: ValidatorError | undefined;

    for (const candidate of candidates) {
      const result = Name.create(candidate);

      if (result.success) {
        return Result.ok(result.data);
      }

      lastError = result.error;
    }

    return Result.fail(
      lastError ?? new ValidatorError('No valid name candidate provided.'),
    );
  }
}
