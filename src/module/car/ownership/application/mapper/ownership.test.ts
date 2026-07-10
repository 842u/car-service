import { OwnershipMapper } from '@/car/ownership/application/mapper/ownership';
import { createMockOwnershipPersistence } from '@/lib/jest/mock/src/module/car/ownership/application/persistence-model/ownership';

describe('OwnershipMapper', () => {
  let mapper: OwnershipMapper;

  beforeEach(() => {
    mapper = new OwnershipMapper();
  });

  describe('persistenceToDto', () => {
    it('maps a row into a camelCase DTO', () => {
      const persistence = createMockOwnershipPersistence();

      const dto = mapper.persistenceToDto(persistence);

      expect(dto.carId).toBe(persistence.car_id);
      expect(dto.ownerId).toBe(persistence.owner_id);
      expect(dto.isPrimary).toBe(persistence.is_primary_owner);
      expect(dto.createdAt).toBe(persistence.created_at);
    });
  });

  describe('persistenceToDomain', () => {
    it('is not implemented until the aggregate is built', () => {
      expect(() => mapper.persistenceToDomain([])).toThrow();
    });
  });

  describe('domainToDto', () => {
    it('is not implemented until the aggregate is built', () => {
      // @ts-expect-error - no CarOwnership instance can be built yet
      expect(() => mapper.domainToDto(null)).toThrow();
    });
  });
});
