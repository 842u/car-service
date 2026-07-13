import { ServiceLogMapper } from '@/car/service-log/application/mapper/service-log';
import { createMockServiceLogPersistence } from '@/lib/jest/mock/src/module/car/service-log/application/persistence-model/service-log';

describe('ServiceLogMapper', () => {
  let mapper: ServiceLogMapper;

  beforeEach(() => {
    mapper = new ServiceLogMapper();
  });

  describe('persistenceToDto', () => {
    it('maps a row into a camelCase DTO', () => {
      const persistence = createMockServiceLogPersistence();

      const dto = mapper.persistenceToDto(persistence);

      expect(dto.id).toBe(persistence.id);
      expect(dto.carId).toBe(persistence.car_id);
      expect(dto.authorId).toBe(persistence.created_by);
      expect(dto.serviceDate).toBe(persistence.service_date);
      expect(dto.categories).toBe(persistence.category);
      expect(dto.mileage).toBe(persistence.mileage);
      expect(dto.notes).toBe(persistence.notes);
      expect(dto.serviceCost).toBe(persistence.service_cost);
      expect(dto.createdAt).toBe(persistence.created_at);
    });
  });
});
