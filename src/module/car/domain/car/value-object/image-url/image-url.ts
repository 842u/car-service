import {
  imageUrlSchema,
  imageUrlValidator,
} from '@/car/domain/car/value-object/image-url/image-url.schema';
import { Result } from '@/common/application/result';
import { ValueObject } from '@/common/domain/value-object';

export class ImageUrl extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: string) {
    const result = imageUrlValidator.validate(
      value,
      imageUrlSchema,
      'Image URL validation failed.',
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    return Result.ok(new ImageUrl(value));
  }
}
