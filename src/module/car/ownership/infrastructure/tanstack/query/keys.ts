const baseKey = 'ownership';

export const queryKeys = {
  ownershipsByCarId: (carId: string) => [baseKey, 'car', carId] as const,
  ownershipsByOwnerId: (ownerId?: string) =>
    [baseKey, 'owner', ownerId] as const,
  ownerProfilesByCarId: (carId: string, ownerIds: string[]) =>
    [baseKey, 'owner-profiles', carId, ownerIds] as const,
} as const;
