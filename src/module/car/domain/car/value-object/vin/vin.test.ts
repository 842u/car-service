import { Vin } from '@/car/domain/car/value-object/vin/vin';

describe('Vin', () => {
  it('accepts a 17-character VIN', () => {
    const result = Vin.create('1HGCM82633A004352');

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.value).toBe('1HGCM82633A004352');
    }
  });

  it('rejects a VIN shorter than 17 characters', () => {
    const result = Vin.create('SHORTVIN');

    expect(result.success).toBe(false);
  });

  it('rejects a VIN longer than 17 characters', () => {
    const result = Vin.create('1HGCM82633A004352EXTRA');

    expect(result.success).toBe(false);
  });
});
