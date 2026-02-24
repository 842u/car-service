import type { AuthClient } from '@/common/application/auth-client';

export function createMockAuthClient() {
  return {
    authenticate: jest.fn(),
    changePassword: jest.fn(),
    exchangeCodeForSession: jest.fn(),
    resetPassword: jest.fn(),
    sendConfirmationEmail: jest.fn(),
    signIn: jest.fn(),
    signInWithOAuth: jest.fn(),
    signOut: jest.fn(),
    signUp: jest.fn(),
    verifyOtp: jest.fn(),
  } as jest.Mocked<AuthClient>;
}
