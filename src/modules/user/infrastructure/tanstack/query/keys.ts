const baseKey = 'user';

export const queryKeys = {
  userSession: [baseKey, 'session'],
  userById: (id: string) => [baseKey, id] as const,
  usersByContext: (context: Record<string, string>) =>
    [baseKey, context] as const,
} as const;
