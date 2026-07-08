import { Mileage } from '@/car/domain/car/value-object/mileage/mileage';
import {
  MAX_MILEAGE_VALUE,
  MIN_MILEAGE_VALUE,
} from '@/car/domain/car/value-object/mileage/mileage.schema';

describe('Mileage', () => {
  it('accepts zero (a brand-new car)', () => {
    const result = Mileage.create(MIN_MILEAGE_VALUE);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.value).toBe(0);
    }
  });

  it('accepts the int4 maximum', () => {
    const result = Mileage.create(MAX_MILEAGE_VALUE);

    expect(result.success).toBe(true);
  });

  it('rejects a negative mileage', () => {
    const result = Mileage.create(-1);

    expect(result.success).toBe(false);
  });

  it('rejects a non-integer mileage', () => {
    const result = Mileage.create(1000.5);

    expect(result.success).toBe(false);
  });

  it('rejects a value above the int4 maximum', () => {
    const result = Mileage.create(MAX_MILEAGE_VALUE + 1);

    expect(result.success).toBe(false);
  });
});
