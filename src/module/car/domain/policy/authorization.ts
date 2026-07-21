import type { Ownership } from '@/car/ownership/domain/ownership/ownership';

/**
 * Whether `actingId` may edit `ownership`'s car. Neither aggregate can
 * answer this alone (`Car` knows nothing of owners), so it is composed
 * here.
 */
export function canEdit(ownership: Ownership, actingId: string): boolean {
  return ownership.isPrimaryOwner(actingId);
}

/**
 * Whether `actingId` may remove `ownership`'s car. Neither aggregate can
 * answer this alone (`Car` knows nothing of owners), so it is composed
 * here.
 */
export function canRemove(ownership: Ownership, actingId: string): boolean {
  return ownership.isPrimaryOwner(actingId);
}
