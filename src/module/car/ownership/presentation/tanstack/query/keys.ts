const baseKey = 'ownership';

export const queryKeys = {
  all: () => [baseKey] as const,
  byCarId: (carId: string) => [...queryKeys.all(), 'car', carId] as const,
  byOwnerId: (ownerId?: string) =>
    [...queryKeys.all(), 'owner', ownerId] as const,
  ownerProfiles: (carId: string) =>
    [...queryKeys.all(), 'owner-profiles', carId] as const,
  ownerProfilesByIds: (carId: string, ownerIds: string[]) =>
    [...queryKeys.ownerProfiles(carId), ownerIds] as const,
} as const;
