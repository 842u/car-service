const baseKey = 'user';

export const queryKeys = {
  sessionUser: [baseKey, 'session'],
  userById: (id: string) => [baseKey, id] as const,
  usersByContext: (context: Record<string, unknown>) =>
    [baseKey, context] as const,
} as const;
