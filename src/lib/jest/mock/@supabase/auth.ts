import type { AuthIdentityPersistence } from '@/common/application/persistence-model/auth-identity';

export function createMockSupabaseAuthModule() {
  return {
    auth: {
      getUser: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      signUp: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn(),
      verifyOtp: jest.fn(),
      exchangeCodeForSession: jest.fn(),
      signInWithOAuth: jest.fn(),
      resend: jest.fn(),
      admin: {
        createUser: jest.fn(),
        deleteUser: jest.fn(),
      },
    },
  };
}

export function createMockAuthIdentity(
  overrides?: Partial<AuthIdentityPersistence>,
) {
  return {
    id: crypto.randomUUID(),
    email: 'user@email.com',
    created_at: new Date().toISOString(),
    aud: '',
    app_metadata: {},
    user_metadata: {},
    ...overrides,
  };
}

export function mockInternalMethodSuccess(
  method: jest.Mock,
  authIdentity: AuthIdentityPersistence | null,
) {
  method.mockResolvedValue({
    data: authIdentity ? { user: authIdentity } : null,
    error: null,
  });
}

export function mockInternalMethodFailure(method: jest.Mock, message: string) {
  method.mockResolvedValue({
    data: null,
    error: {
      message,
      code: 'auth_module_error',
      status: 500,
    },
  });
}
