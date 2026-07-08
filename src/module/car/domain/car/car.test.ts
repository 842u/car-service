import { Car } from '@/car/domain/car/car';
import { CarId } from '@/car/domain/car/value-object/car-id/car-id';

const VALID_ID = '11111111-1111-4111-8111-111111111111';

const validParams = {
  id: VALID_ID,
  customName: 'Daily driver',
  brand: 'Toyota',
  model: 'Corolla',
  licensePlates: 'ABC123',
  vin: '1HGCM82633A004352',
  fuelType: 'gasoline',
  additionalFuelType: null,
  transmissionType: 'manual',
  driveType: 'FWD',
  productionYear: 2015,
  engineCapacity: 1600,
  mileage: 120000,
  insuranceExpiration: '2026-01-01',
  technicalInspectionExpiration: '2026-06-01',
};

describe('CarId', () => {
  it('generates a valid id', () => {
    const generated = CarId.generate();

    const result = CarId.create(generated.value);

    expect(result.success).toBe(true);
  });
});

describe('Car', () => {
  describe('create', () => {
    it('builds a car from valid params', () => {
      const result = Car.create(validParams);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id.value).toBe(VALID_ID);
        expect(result.data.customName.value).toBe('Daily driver');
        expect(result.data.brand?.value).toBe('Toyota');
        expect(result.data.imageUrl).toBeNull();
      }
    });

    it('leaves nullable fields null when omitted', () => {
      const result = Car.create({
        id: VALID_ID,
        customName: 'Minimal',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.brand).toBeNull();
        expect(result.data.mileage).toBeNull();
        expect(result.data.fuelType).toBeNull();
      }
    });

    it('fails when the id is not a uuid', () => {
      const result = Car.create({ ...validParams, id: 'not-a-uuid' });

      expect(result.success).toBe(false);
    });

    it('fails when a field is invalid', () => {
      const result = Car.create({ ...validParams, vin: 'TOO-SHORT' });

      expect(result.success).toBe(false);
    });
  });

  describe('edit', () => {
    it('atomically replaces the editable fields', () => {
      const created = Car.create(validParams);
      expect(created.success).toBe(true);
      if (!created.success) {
        return;
      }
      const car = created.data;

      const result = car.edit({
        customName: 'Weekend car',
        brand: 'Mazda',
        mileage: 5000,
      });

      expect(result.success).toBe(true);
      expect(car.customName.value).toBe('Weekend car');
      expect(car.brand?.value).toBe('Mazda');
      expect(car.mileage?.value).toBe(5000);
      // Fields not supplied are cleared (atomic replace, not merge).
      expect(car.vin).toBeNull();
    });

    it('rejects an invalid edit and leaves the car unchanged', () => {
      const created = Car.create(validParams);
      expect(created.success).toBe(true);
      if (!created.success) {
        return;
      }
      const car = created.data;

      const result = car.edit({ customName: '', brand: 'Mazda' });

      expect(result.success).toBe(false);
      expect(car.customName.value).toBe('Daily driver');
      expect(car.brand?.value).toBe('Toyota');
    });

    it('does not touch the id or image url', () => {
      const created = Car.create({
        ...validParams,
        imageUrl: 'https://cdn.test/x.png',
      });
      expect(created.success).toBe(true);
      if (!created.success) {
        return;
      }
      const car = created.data;

      car.edit({ customName: 'Renamed' });

      expect(car.id.value).toBe(VALID_ID);
      expect(car.imageUrl?.value).toBe('https://cdn.test/x.png');
    });
  });

  describe('changeImageUrl', () => {
    it('sets and clears the image url', () => {
      const created = Car.create(validParams);
      expect(created.success).toBe(true);
      if (!created.success) {
        return;
      }
      const car = created.data;

      expect(car.changeImageUrl('https://cdn.test/car.png').success).toBe(true);
      expect(car.imageUrl?.value).toBe('https://cdn.test/car.png');

      expect(car.changeImageUrl(null).success).toBe(true);
      expect(car.imageUrl).toBeNull();
    });

    it('rejects an invalid image url', () => {
      const created = Car.create(validParams);
      expect(created.success).toBe(true);
      if (!created.success) {
        return;
      }
      const car = created.data;

      const result = car.changeImageUrl('not-a-url');

      expect(result.success).toBe(false);
    });
  });
});
