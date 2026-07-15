import { jest } from '@jest/globals';

import type {
  AdminAuthClient,
  AuthClient,
} from '@/common/application/auth-client';

export function createMockAuthClient(): jest.Mocked<AuthClient> {
  return {
    authenticate: jest.fn<AuthClient['authenticate']>(),
    changePassword: jest.fn<AuthClient['changePassword']>(),
    exchangeCodeForSession: jest.fn<AuthClient['exchangeCodeForSession']>(),
    resetPassword: jest.fn<AuthClient['resetPassword']>(),
    sendConfirmationEmail: jest.fn<AuthClient['sendConfirmationEmail']>(),
    signIn: jest.fn<AuthClient['signIn']>(),
    signInWithOAuth: jest.fn<AuthClient['signInWithOAuth']>(),
    signOut: jest.fn<AuthClient['signOut']>(),
    signUp: jest.fn<AuthClient['signUp']>(),
    verifyOtp: jest.fn<AuthClient['verifyOtp']>(),
  };
}

export function createMockAdminAuthClient(): jest.Mocked<AdminAuthClient> {
  return {
    ...createMockAuthClient(),
    createAuthIdentity: jest.fn<AdminAuthClient['createAuthIdentity']>(),
    deleteAuthIdentity: jest.fn<AdminAuthClient['deleteAuthIdentity']>(),
  };
}
