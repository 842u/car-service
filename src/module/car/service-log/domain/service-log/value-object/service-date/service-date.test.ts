import { ServiceDate } from '@/car/service-log/domain/service-log/value-object/service-date/service-date';
import { MAX_SERVICE_DATE } from '@/car/service-log/domain/service-log/value-object/service-date/service-date.schema';

describe('ServiceDate', () => {
  it('accepts a valid yyyy-mm-dd date', () => {
    const result = ServiceDate.create('2026-07-08');

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.value).toBe('2026-07-08');
    }
  });

  it('rejects a date before 1885-01-01', () => {
    const result = ServiceDate.create('1884-12-31');

    expect(result.success).toBe(false);
  });

  it('accepts the maximum date', () => {
    const result = ServiceDate.create(MAX_SERVICE_DATE);

    expect(result.success).toBe(true);
  });

  it('rejects a date beyond the maximum', () => {
    const [year] = MAX_SERVICE_DATE.split('-');
    const result = ServiceDate.create(`${Number(year) + 1}-01-01`);

    expect(result.success).toBe(false);
  });

  it('rejects a malformed date string', () => {
    const result = ServiceDate.create('08/07/2026');

    expect(result.success).toBe(false);
  });
});
