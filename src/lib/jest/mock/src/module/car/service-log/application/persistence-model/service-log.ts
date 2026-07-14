import type { ServiceLogPersistence } from '@/car/service-log/application/persistence-model/service-log';

export function createMockServiceLogPersistence(
  overrides?: Partial<ServiceLogPersistence>,
): ServiceLogPersistence {
  return {
    id: '11111111-1111-4111-8111-111111111111',
    car_id: '5202140b-aa28-4058-9191-e4a117e15353',
    created_by: 'b5b55395-e32f-4376-be03-f66be0a63ec4',
    category: ['engine'],
    mileage: 100000,
    notes: null,
    service_cost: 100,
    service_date: '2024-01-01',
    created_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}
