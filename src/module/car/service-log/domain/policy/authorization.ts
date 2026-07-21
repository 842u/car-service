import type { Ownership } from '@/car/ownership/domain/ownership/ownership';
import type { ServiceLog } from '@/car/service-log/domain/service-log/service-log';

/**
 * Whether `actingId` may edit `serviceLog`. Its Author or the car's primary
 * owner may; a co-owner who did not author it may not. Neither aggregate can
 * answer this alone (`ServiceLog` knows its Author, only `Ownership` knows
 * who is primary), so it is composed here.
 */
export function canEdit(
  serviceLog: ServiceLog,
  ownership: Ownership,
  actingId: string,
): boolean {
  return (
    serviceLog.isAuthoredBy(actingId) || ownership.isPrimaryOwner(actingId)
  );
}

/**
 * Whether `actingId` may remove `serviceLog`. Its Author or the car's primary
 * owner may; a co-owner who did not author it may not. Neither aggregate can
 * answer this alone (`ServiceLog` knows its Author, only `Ownership` knows
 * who is primary), so it is composed here.
 */
export function canRemove(
  serviceLog: ServiceLog,
  ownership: Ownership,
  actingId: string,
): boolean {
  return (
    serviceLog.isAuthoredBy(actingId) || ownership.isPrimaryOwner(actingId)
  );
}
