import { CarMapper } from '@/car/application/mapper/car';
import { buildCarPersistence } from '@/car/application/persistence-model/car.builder';
import { buildCar } from '@/car/domain/car/car.builder';

describe('CarMapper', () => {
  let mapper: CarMapper;

  beforeEach(() => {
    mapper = new CarMapper();
  });

  describe('persistenceToDomain', () => {
    it('maps a row into a Car aggregate', () => {
      const persistence = buildCarPersistence();

      const result = mapper.persistenceToDomain(persistence);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id.value).toBe(persistence.id);
        expect(result.data.customName.value).toBe(persistence.custom_name);
        expect(result.data.vin?.value).toBe(persistence.vin);
      }
    });

    it('fails when a column violates a domain rule', () => {
      const persistence = buildCarPersistence({ vin: 'too-short' });

      const result = mapper.persistenceToDomain(persistence);

      expect(result.success).toBe(false);
    });
  });

  describe('domainToPersistence', () => {
    it('round-trips a row through the domain, omitting managed columns', () => {
      const persistence = buildCarPersistence();

      const domainResult = mapper.persistenceToDomain(persistence);
      expect(domainResult.success).toBe(true);
      if (!domainResult.success) {
        return;
      }

      const row = mapper.domainToPersistence(domainResult.data);

      const { created_at, created_by, ...writable } = persistence;
      expect(row).toEqual(writable);
      expect(row).not.toHaveProperty('created_at');
      expect(row).not.toHaveProperty('created_by');
    });
  });

  describe('domainToDto', () => {
    it('maps every present optional field through and a null createdAt', () => {
      const persistence = buildCarPersistence();

      const domainResult = mapper.persistenceToDomain(persistence);
      expect(domainResult.success).toBe(true);
      if (!domainResult.success) {
        return;
      }

      const dto = mapper.domainToDto(domainResult.data);

      expect(dto.id).toBe(persistence.id);
      expect(dto.imageUrl).toBe(persistence.image_url);
      expect(dto.customName).toBe(persistence.custom_name);
      expect(dto.brand).toBe(persistence.brand);
      expect(dto.model).toBe(persistence.model);
      expect(dto.licensePlates).toBe(persistence.license_plates);
      expect(dto.vin).toBe(persistence.vin);
      expect(dto.fuelType).toBe(persistence.fuel_type);
      expect(dto.additionalFuelType).toBe(persistence.additional_fuel_type);
      expect(dto.transmissionType).toBe(persistence.transmission_type);
      expect(dto.driveType).toBe(persistence.drive_type);
      expect(dto.productionYear).toBe(persistence.production_year);
      expect(dto.engineCapacity).toBe(persistence.engine_capacity);
      expect(dto.mileage).toBe(persistence.mileage);
      expect(dto.insuranceExpiration).toBe(persistence.insurance_expiration);
      expect(dto.technicalInspectionExpiration).toBe(
        persistence.technical_inspection_expiration,
      );
      expect(dto.createdAt).toBeNull();
    });

    it('maps every absent optional field to null', () => {
      const car = buildCar();

      const dto = mapper.domainToDto(car);

      expect(dto.imageUrl).toBeNull();
      expect(dto.brand).toBeNull();
      expect(dto.model).toBeNull();
      expect(dto.licensePlates).toBeNull();
      expect(dto.vin).toBeNull();
      expect(dto.fuelType).toBeNull();
      expect(dto.additionalFuelType).toBeNull();
      expect(dto.transmissionType).toBeNull();
      expect(dto.driveType).toBeNull();
      expect(dto.productionYear).toBeNull();
      expect(dto.engineCapacity).toBeNull();
      expect(dto.mileage).toBeNull();
      expect(dto.insuranceExpiration).toBeNull();
      expect(dto.technicalInspectionExpiration).toBeNull();
      expect(dto.createdAt).toBeNull();
    });
  });

  describe('persistenceToDto', () => {
    it('maps a row into a camelCase DTO including createdAt', () => {
      const persistence = buildCarPersistence();

      const dto = mapper.persistenceToDto(persistence);

      expect(dto.id).toBe(persistence.id);
      expect(dto.customName).toBe(persistence.custom_name);
      expect(dto.fuelType).toBe(persistence.fuel_type);
      expect(dto.productionYear).toBe(persistence.production_year);
      expect(dto.createdAt).toBe(persistence.created_at);
    });
  });
});
