import { ServiceLog } from '@/car/service-log/domain/service-log/service-log';

const SERVICE_LOG_ID = '11111111-1111-4111-8111-111111111111';
const CAR_ID = '22222222-2222-4222-8222-222222222222';
const AUTHOR_ID = '33333333-3333-4333-8333-333333333333';
const OTHER_USER_ID = '44444444-4444-4444-8444-444444444444';

const validParams = {
  id: SERVICE_LOG_ID,
  carId: CAR_ID,
  authorId: AUTHOR_ID,
  serviceDate: '2026-07-08',
  categories: ['engine', 'brakes'],
  mileage: 50000,
  note: 'Replaced brake pads.',
  serviceCost: 149.99,
};

describe('ServiceLog', () => {
  describe('create', () => {
    it('builds a service log from valid params', () => {
      const result = ServiceLog.create(validParams);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id.value).toBe(SERVICE_LOG_ID);
        expect(result.data.carId.value).toBe(CAR_ID);
        expect(result.data.authorId.value).toBe(AUTHOR_ID);
        expect(result.data.serviceDate.value).toBe('2026-07-08');
        expect(result.data.categories.value).toEqual(['brakes', 'engine']);
        expect(result.data.mileage?.value).toBe(50000);
        expect(result.data.note?.value).toBe('Replaced brake pads.');
        expect(result.data.serviceCost?.value).toBe(149.99);
      }
    });

    it('leaves mileage, note, and serviceCost null when omitted', () => {
      const result = ServiceLog.create({
        id: SERVICE_LOG_ID,
        carId: CAR_ID,
        authorId: AUTHOR_ID,
        serviceDate: '2026-07-08',
        categories: ['engine'],
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.mileage).toBeNull();
        expect(result.data.note).toBeNull();
        expect(result.data.serviceCost).toBeNull();
      }
    });

    it('fails when the id is not a uuid', () => {
      const result = ServiceLog.create({ ...validParams, id: 'not-a-uuid' });

      expect(result.success).toBe(false);
    });

    it('fails when categories is empty', () => {
      const result = ServiceLog.create({ ...validParams, categories: [] });

      expect(result.success).toBe(false);
    });

    it('fails when a field is invalid', () => {
      const result = ServiceLog.create({ ...validParams, mileage: -1 });

      expect(result.success).toBe(false);
    });
  });

  describe('isAuthoredBy', () => {
    it('returns true for the author', () => {
      const result = ServiceLog.create(validParams);
      expect(result.success).toBe(true);
      if (!result.success) return;

      expect(result.data.isAuthoredBy(AUTHOR_ID)).toBe(true);
    });

    it('returns false for a different user', () => {
      const result = ServiceLog.create(validParams);
      expect(result.success).toBe(true);
      if (!result.success) return;

      expect(result.data.isAuthoredBy(OTHER_USER_ID)).toBe(false);
    });
  });
});
