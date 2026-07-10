import { InsuranceExpiration } from '@/car/domain/car/value-object/insurance-expiration/insurance-expiration';

describe('InsuranceExpiration', () => {
  it('accepts a valid yyyy-mm-dd date', () => {
    const result = InsuranceExpiration.create('2026-07-08');

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.value).toBe('2026-07-08');
    }
  });

  it('rejects a date before 1885-01-01', () => {
    const result = InsuranceExpiration.create('1884-12-31');

    expect(result.success).toBe(false);
  });

  it('rejects a malformed date string', () => {
    const result = InsuranceExpiration.create('08/07/2026');

    expect(result.success).toBe(false);
  });
});
