import type { CarOwnership } from '@/types';

export function createMockCarOwnership({
  car_id = '5202140b-aa28-4058-9191-e4a117e15353',
  created_at = null,
  is_primary_owner = false,
  owner_id = 'b5b55395-e32f-4376-be03-f66be0a63ec4',
}: Partial<CarOwnership> = {}): CarOwnership {
  return {
    car_id,
    created_at,
    is_primary_owner,
    owner_id,
  };
}
