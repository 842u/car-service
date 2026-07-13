import {
  serviceNoteSchema,
  serviceNoteValidator,
} from '@/car/service-log/domain/service-log/value-object/service-note/service-note.schema';
import { Result } from '@/common/application/result';
import { ValueObject } from '@/common/domain/value-object';

export class ServiceNote extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string) {
    const result = serviceNoteValidator.validate(
      value,
      serviceNoteSchema,
      'Service note validation failed.',
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new ServiceNote(result.data));
  }
}
