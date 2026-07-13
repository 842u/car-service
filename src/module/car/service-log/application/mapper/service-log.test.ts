import { ServiceLogMapper } from '@/car/service-log/application/mapper/service-log';
import { ServiceLog } from '@/car/service-log/domain/service-log/service-log';
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

  describe('persistenceToDomain', () => {
    it('builds a valid ServiceLog from a persisted row', () => {
      const persistence = createMockServiceLogPersistence();

      const result = mapper.persistenceToDomain(persistence);

      expect(result.success).toBe(true);
      if (!result.success) return;

      expect(result.data.id.value).toBe(persistence.id);
      expect(result.data.carId.value).toBe(persistence.car_id);
      expect(result.data.authorId.value).toBe(persistence.created_by);
      expect(result.data.serviceDate.value).toBe(persistence.service_date);
      expect(result.data.categories.value).toEqual(persistence.category);
      expect(result.data.mileage?.value).toBe(persistence.mileage);
      expect(result.data.serviceCost?.value).toBe(persistence.service_cost);
    });

    it('fails when the row holds an invalid value', () => {
      const persistence = createMockServiceLogPersistence({ id: 'not-a-uuid' });

      const result = mapper.persistenceToDomain(persistence);

      expect(result.success).toBe(false);
    });
  });

  describe('domainToDto', () => {
    it('maps a ServiceLog into a DTO with a null createdAt', () => {
      const persistence = createMockServiceLogPersistence();
      const serviceLogResult = ServiceLog.create({
        id: persistence.id,
        carId: persistence.car_id,
        authorId: persistence.created_by,
        serviceDate: persistence.service_date,
        categories: persistence.category,
        mileage: persistence.mileage,
        note: persistence.notes,
        serviceCost: persistence.service_cost,
      });

      expect(serviceLogResult.success).toBe(true);
      if (!serviceLogResult.success) return;

      const dto = mapper.domainToDto(serviceLogResult.data);

      expect(dto.id).toBe(persistence.id);
      expect(dto.carId).toBe(persistence.car_id);
      expect(dto.authorId).toBe(persistence.created_by);
      expect(dto.serviceDate).toBe(persistence.service_date);
      expect(dto.categories).toEqual(persistence.category);
      expect(dto.mileage).toBe(persistence.mileage);
      // `?.value` yields `undefined` (not `null`) for an absent optional
      // field, matching CarMapper's domainToDto convention.
      expect(dto.notes ?? null).toBe(persistence.notes);
      expect(dto.serviceCost).toBe(persistence.service_cost);
      expect(dto.createdAt).toBeNull();
    });
  });

  describe('domainToPersistence', () => {
    it('maps a ServiceLog into an insertable row without created_at', () => {
      const persistence = createMockServiceLogPersistence();
      const serviceLogResult = ServiceLog.create({
        id: persistence.id,
        carId: persistence.car_id,
        authorId: persistence.created_by,
        serviceDate: persistence.service_date,
        categories: persistence.category,
        mileage: persistence.mileage,
        note: persistence.notes,
        serviceCost: persistence.service_cost,
      });

      expect(serviceLogResult.success).toBe(true);
      if (!serviceLogResult.success) return;

      const row = mapper.domainToPersistence(serviceLogResult.data);

      expect(row.id).toBe(persistence.id);
      expect(row.car_id).toBe(persistence.car_id);
      expect(row.created_by).toBe(persistence.created_by);
      expect(row.service_date).toBe(persistence.service_date);
      expect(row.category).toEqual(persistence.category);
      expect(row.mileage).toBe(persistence.mileage);
      expect(row.notes).toBe(persistence.notes);
      expect(row.service_cost).toBe(persistence.service_cost);
      expect(row.created_at).toBeUndefined();
    });
  });
});
