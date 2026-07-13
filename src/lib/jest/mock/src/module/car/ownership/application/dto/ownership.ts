import type { OwnershipDto } from '@/car/ownership/application/dto/ownership';

export function createMockOwnershipDto(
  overrides?: Partial<OwnershipDto>,
): OwnershipDto {
  return {
    carId: '5202140b-aa28-4058-9191-e4a117e15353',
    ownerId: 'b5b55395-e32f-4376-be03-f66be0a63ec4',
    isPrimary: false,
    createdAt: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}
