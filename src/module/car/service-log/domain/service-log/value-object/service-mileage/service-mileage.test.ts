import { ServiceMileage } from '@/car/service-log/domain/service-log/value-object/service-mileage/service-mileage';
import {
  MAX_SERVICE_MILEAGE_VALUE,
  MIN_SERVICE_MILEAGE_VALUE,
} from '@/car/service-log/domain/service-log/value-object/service-mileage/service-mileage.schema';

describe('ServiceMileage', () => {
  it('accepts zero', () => {
    const result = ServiceMileage.create(MIN_SERVICE_MILEAGE_VALUE);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.value).toBe(0);
    }
  });

  it('accepts the int4 maximum', () => {
    const result = ServiceMileage.create(MAX_SERVICE_MILEAGE_VALUE);

    expect(result.success).toBe(true);
  });

  it('rejects a negative mileage', () => {
    const result = ServiceMileage.create(-1);

    expect(result.success).toBe(false);
  });

  it('rejects a non-integer mileage', () => {
    const result = ServiceMileage.create(1000.5);

    expect(result.success).toBe(false);
  });

  it('rejects a value above the int4 maximum', () => {
    const result = ServiceMileage.create(MAX_SERVICE_MILEAGE_VALUE + 1);

    expect(result.success).toBe(false);
  });
});
