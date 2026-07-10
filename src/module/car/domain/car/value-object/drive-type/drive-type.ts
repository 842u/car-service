import {
  driveTypeSchema,
  driveTypeValidator,
  type DriveValue,
} from '@/car/domain/car/value-object/drive-type/drive-type.schema';
import { Result } from '@/common/application/result';
import { ValueObject } from '@/common/domain/value-object';

export class DriveType extends ValueObject<DriveValue> {
  private constructor(value: DriveValue) {
    super(value);
  }

  static create(value: string) {
    const result = driveTypeValidator.validate(
      value,
      driveTypeSchema,
      'Drive type validation failed.',
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new DriveType(result.data));
  }
}
