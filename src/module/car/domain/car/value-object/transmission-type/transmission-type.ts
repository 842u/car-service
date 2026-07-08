import {
  transmissionTypeSchema,
  transmissionTypeValidator,
  type TransmissionValue,
} from '@/car/domain/car/value-object/transmission-type/transmission-type.schema';
import { Result } from '@/common/application/result';
import { ValueObject } from '@/common/domain/value-object';

export class TransmissionType extends ValueObject<TransmissionValue> {
  private constructor(value: TransmissionValue) {
    super(value);
  }

  static create(value: string) {
    const result = transmissionTypeValidator.validate(
      value,
      transmissionTypeSchema,
      'Transmission type validation failed.',
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new TransmissionType(result.data));
  }
}
