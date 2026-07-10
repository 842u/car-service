import { FuelType } from '@/car/domain/car/value-object/fuel-type/fuel-type';

describe('FuelType', () => {
  it('accepts a canonical fuel value', () => {
    const result = FuelType.create('electric');

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.value).toBe('electric');
    }
  });

  it('rejects a value outside the enum', () => {
    const result = FuelType.create('coal');

    expect(result.success).toBe(false);
  });
});
