import type { CarOwnership } from '@/car/ownership/domain/ownership/car-ownership';

/**
 * Whether `actingId` may record a new Service Log against the car `ownership`
 * describes. Any owner (primary or co-owner) may record one; neither
 * `ServiceLog` nor `CarOwnership` can answer this alone, so it is composed
 * here rather than embedded in either aggregate.
 */
export function canRecord(ownership: CarOwnership, actingId: string): boolean {
  return ownership.isOwner(actingId);
}
