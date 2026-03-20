import type { ServiceLog } from '@/types';

export function createMockServiceLog({
  car_id = '5202140b-aa28-4058-9191-e4a117e15353',
  category = ['engine'],
  created_at = null,
  created_by = 'b5b55395-e32f-4376-be03-f66be0a63ec4',
  id = crypto.randomUUID(),
  mileage = 100000,
  notes = null,
  service_cost = 100,
  service_date = new Date().toISOString(),
}: Partial<ServiceLog> = {}): ServiceLog {
  return {
    car_id,
    category,
    created_at,
    created_by,
    id,
    mileage,
    notes,
    service_cost,
    service_date,
  };
}
