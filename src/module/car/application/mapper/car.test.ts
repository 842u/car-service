import { CarMapper } from '@/car/application/mapper/car';
import { createMockCarPersistence } from '@/lib/jest/mock/src/module/car/application/persistence-model/car';

describe('CarMapper', () => {
  let mapper: CarMapper;

  beforeEach(() => {
    mapper = new CarMapper();
  });

  describe('persistenceToDomain', () => {
    it('maps a row into a Car aggregate', () => {
      const persistence = createMockCarPersistence();

      const result = mapper.persistenceToDomain(persistence);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id.value).toBe(persistence.id);
        expect(result.data.customName.value).toBe(persistence.custom_name);
        expect(result.data.vin?.value).toBe(persistence.vin);
      }
    });

    it('fails when a column violates a domain rule', () => {
      const persistence = createMockCarPersistence({ vin: 'too-short' });

      const result = mapper.persistenceToDomain(persistence);

      expect(result.success).toBe(false);
    });
  });

  describe('domainToPersistence', () => {
    it('round-trips a row through the domain, omitting managed columns', () => {
      const persistence = createMockCarPersistence();

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

  describe('persistenceToDto', () => {
    it('maps a row into a camelCase DTO including createdAt', () => {
      const persistence = createMockCarPersistence();

      const dto = mapper.persistenceToDto(persistence);

      expect(dto.id).toBe(persistence.id);
      expect(dto.customName).toBe(persistence.custom_name);
      expect(dto.fuelType).toBe(persistence.fuel_type);
      expect(dto.productionYear).toBe(persistence.production_year);
      expect(dto.createdAt).toBe(persistence.created_at);
    });
  });

  describe('dtoToPersistence', () => {
    it('maps a DTO back into a snake_case row, with createdBy null', () => {
      const persistence = createMockCarPersistence();
      const dto = mapper.persistenceToDto(persistence);

      const row = mapper.dtoToPersistence(dto);

      expect(row.id).toBe(dto.id);
      expect(row.custom_name).toBe(dto.customName);
      expect(row.fuel_type).toBe(dto.fuelType);
      expect(row.production_year).toBe(dto.productionYear);
      expect(row.created_at).toBe(dto.createdAt);
      expect(row.created_by).toBeNull();
    });
  });
});
