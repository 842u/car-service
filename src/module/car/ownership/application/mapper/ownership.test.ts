import { CarId } from '@/car/domain/car/value-object/car-id/car-id';
import { OwnershipMapper } from '@/car/ownership/application/mapper/ownership';
import { CarOwnership } from '@/car/ownership/domain/ownership/car-ownership';
import { OwnerId } from '@/car/ownership/domain/ownership/value-object/owner-id/owner-id';
import { createMockOwnershipPersistence } from '@/lib/jest/mock/src/module/car/ownership/application/persistence-model/ownership';

const CAR_ID = '11111111-1111-4111-8111-111111111111';
const PRIMARY_OWNER_ID = '22222222-2222-4222-8222-222222222222';
const CO_OWNER_ID = '33333333-3333-4333-8333-333333333333';

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
    it('reconstitutes a CarOwnership from its rows', () => {
      const rows = [
        createMockOwnershipPersistence({
          car_id: CAR_ID,
          owner_id: PRIMARY_OWNER_ID,
          is_primary_owner: true,
        }),
        createMockOwnershipPersistence({
          car_id: CAR_ID,
          owner_id: CO_OWNER_ID,
          is_primary_owner: false,
        }),
      ];

      const result = mapper.persistenceToDomain(rows);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id.value).toBe(CAR_ID);
        expect(result.data.primaryOwner.value).toBe(PRIMARY_OWNER_ID);
        expect(result.data.coOwners.map((owner) => owner.value)).toEqual([
          CO_OWNER_ID,
        ]);
      }
    });

    it('fails when no row is flagged as primary', () => {
      const rows = [
        createMockOwnershipPersistence({
          car_id: CAR_ID,
          owner_id: CO_OWNER_ID,
          is_primary_owner: false,
        }),
      ];

      const result = mapper.persistenceToDomain(rows);

      expect(result.success).toBe(false);
    });

    it('fails when more than one row is flagged as primary', () => {
      const rows = [
        createMockOwnershipPersistence({
          car_id: CAR_ID,
          owner_id: PRIMARY_OWNER_ID,
          is_primary_owner: true,
        }),
        createMockOwnershipPersistence({
          car_id: CAR_ID,
          owner_id: CO_OWNER_ID,
          is_primary_owner: true,
        }),
      ];

      const result = mapper.persistenceToDomain(rows);

      expect(result.success).toBe(false);
    });

    it('fails on an empty row set', () => {
      const result = mapper.persistenceToDomain([]);

      expect(result.success).toBe(false);
    });
  });

  describe('domainToDto', () => {
    it('projects the primary owner and every co-owner as row-shaped DTOs', () => {
      const idResult = CarId.create(CAR_ID);
      const primaryOwnerResult = OwnerId.create(PRIMARY_OWNER_ID);
      const coOwnerResult = OwnerId.create(CO_OWNER_ID);

      if (
        !idResult.success ||
        !primaryOwnerResult.success ||
        !coOwnerResult.success
      ) {
        throw new Error('Failed to build test fixture.');
      }

      const carOwnership = CarOwnership.reconstitute({
        id: idResult.data,
        primaryOwner: primaryOwnerResult.data,
        coOwners: [coOwnerResult.data],
      });

      const dtos = mapper.domainToDto(carOwnership);

      expect(dtos).toEqual([
        {
          carId: CAR_ID,
          ownerId: PRIMARY_OWNER_ID,
          isPrimary: true,
          createdAt: null,
        },
        {
          carId: CAR_ID,
          ownerId: CO_OWNER_ID,
          isPrimary: false,
          createdAt: null,
        },
      ]);
    });
  });

  describe('newCoOwnerToPersistence', () => {
    it('builds the insert row for a new co-owner', () => {
      const idResult = CarId.create(CAR_ID);
      const ownerIdResult = OwnerId.create(CO_OWNER_ID);

      if (!idResult.success || !ownerIdResult.success) {
        throw new Error('Failed to build test fixture.');
      }

      const row = mapper.newCoOwnerToPersistence(
        idResult.data,
        ownerIdResult.data,
      );

      expect(row).toEqual({
        car_id: CAR_ID,
        owner_id: CO_OWNER_ID,
        is_primary_owner: false,
      });
    });
  });
});
