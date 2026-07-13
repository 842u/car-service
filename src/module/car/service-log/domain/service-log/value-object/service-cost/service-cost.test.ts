import { ServiceCost } from '@/car/service-log/domain/service-log/value-object/service-cost/service-cost';

describe('ServiceCost', () => {
  it('accepts a valid cost', () => {
    const result = ServiceCost.create(149.99);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.value).toBe(149.99);
    }
  });

  it('accepts zero', () => {
    const result = ServiceCost.create(0);

    expect(result.success).toBe(true);
  });

  it('rejects a negative cost', () => {
    const result = ServiceCost.create(-1);

    expect(result.success).toBe(false);
  });

  it('rejects more than two decimal places', () => {
    const result = ServiceCost.create(10.999);

    expect(result.success).toBe(false);
  });
});
