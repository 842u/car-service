const baseKey = 'user';

export const queryKeys = {
  sessionUser: [baseKey, 'session'],
  userById: (id: string) => [baseKey, id] as const,
} as const;
