const baseKey = 'ownership';

export const queryKeys = {
  ownershipsByCarId: (carId: string) => [baseKey, 'car', carId] as const,
  ownershipsByOwnerId: (ownerId?: string) =>
    [baseKey, 'owner', ownerId] as const,
  ownerProfilesByCarId: (carId: string, ownerIds: string[]) =>
    [baseKey, 'owner-profiles', carId, ownerIds] as const,
  /**
   * Prefix of `ownerProfilesByCarId`, without the `ownerIds` array. Adding an
   * owner changes that array, so the exact key can't be predicted client-side
   * before the mutation resolves; invalidating by this prefix matches every
   * `ownerIds` variant cached for the car.
   */
  ownerProfilesByCarIdPrefix: (carId: string) =>
    [baseKey, 'owner-profiles', carId] as const,
} as const;
