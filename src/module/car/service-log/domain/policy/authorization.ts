import type { Ownership } from '@/car/ownership/domain/ownership/ownership';
import type { ServiceLog } from '@/car/service-log/domain/service-log/service-log';

/**
 * Whether `actingId` may record a new Service Log against the car `ownership`
 * describes. Any owner (primary or co-owner) may record one; neither
 * `ServiceLog` nor `Ownership` can answer this alone, so it is composed
 * here rather than embedded in either aggregate.
 */
export function canRecord(ownership: Ownership, actingId: string): boolean {
  return ownership.isOwner(actingId);
}

/**
 * Whether `actingId` may edit or remove `serviceLog`. Its Author or the car's
 * primary owner may; a co-owner who did not author it may not. Neither
 * aggregate can answer this alone (`ServiceLog` knows its Author, only
 * `Ownership` knows who is primary), so it is composed here.
 */
export function canModify(
  serviceLog: ServiceLog,
  ownership: Ownership,
  actingId: string,
): boolean {
  return (
    serviceLog.isAuthoredBy(actingId) || ownership.isPrimaryOwner(actingId)
  );
}
