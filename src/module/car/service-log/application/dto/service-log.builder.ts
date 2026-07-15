import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';

export function buildServiceLogDto(
  overrides?: Partial<ServiceLogDto>,
): ServiceLogDto {
  return {
    id: '11111111-1111-4111-8111-111111111111',
    carId: '5202140b-aa28-4058-9191-e4a117e15353',
    authorId: 'b5b55395-e32f-4376-be03-f66be0a63ec4',
    serviceDate: '2024-01-01T00:00:00Z',
    categories: ['engine'],
    mileage: 100000,
    notes: null,
    serviceCost: 100,
    createdAt: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}
