const baseKey = 'ownership';

export const queryKeys = {
  all: () => [baseKey] as const,
  byCarId: (carId: string) => [...queryKeys.all(), 'car', carId] as const,
  byOwnerId: (ownerId?: string) =>
    [...queryKeys.all(), 'owner', ownerId] as const,
} as const;
