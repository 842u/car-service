import { ServiceCategories } from '@/car/service-log/domain/service-log/value-object/service-categories/service-categories';

describe('ServiceCategories', () => {
  it('accepts a single valid category', () => {
    const result = ServiceCategories.create(['engine']);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.value).toEqual(['engine']);
    }
  });

  it('dedupes and sorts categories', () => {
    const result = ServiceCategories.create(['tires', 'brakes', 'tires']);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.value).toEqual(['brakes', 'tires']);
    }
  });

  it('rejects an empty set', () => {
    const result = ServiceCategories.create([]);

    expect(result.success).toBe(false);
  });

  it('rejects an unknown category', () => {
    const result = ServiceCategories.create(['not-a-category']);

    expect(result.success).toBe(false);
  });
});
