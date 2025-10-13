import { createBrowserClient } from '@supabase/ssr';
import type { Provider, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'supabase/types/supabase';

import { SupabaseAuthClient } from '@/common/infrastructure/auth-client/supabase';
import {
  createMockAuthIdentity,
  mockMethodFailure,
  mockMethodSuccess,
} from '@/lib/jest/mock/@supabase/auth';

describe('SupabaseAuthClient', () => {
  let mockInternalAuthClient: SupabaseClient<Database>['auth'];
  let authClient: SupabaseAuthClient;

  beforeEach(() => {
    jest.clearAllMocks();
    const mockSupabaseClient = createBrowserClient('mock-url', 'mock-key');
    mockInternalAuthClient = mockSupabaseClient.auth;
    authClient = new SupabaseAuthClient(mockSupabaseClient);
  });

  describe('authenticate', () => {
    it('should return auth identity on success', async () => {
      const mockAuthIdentity = createMockAuthIdentity();
      mockMethodSuccess(
        mockInternalAuthClient.getUser as jest.Mock,
        mockAuthIdentity,
      );

      const result = await authClient.authenticate();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockAuthIdentity);
      }
      expect(mockInternalAuthClient.getUser).toHaveBeenCalledTimes(1);
    });

    it('should return error on failure', async () => {
      const errorMessage = 'test error';
      mockMethodFailure(
        mockInternalAuthClient.getUser as jest.Mock,
        errorMessage,
      );

      const result = await authClient.authenticate();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(errorMessage);
      }
    });
  });

  describe('signIn', () => {
    it('should sign in user successfully', async () => {
      const mockAuthIdentity = createMockAuthIdentity();
      mockMethodSuccess(
        mockInternalAuthClient.signInWithPassword as jest.Mock,
        mockAuthIdentity,
      );
      const credentials = {
        email: mockAuthIdentity.email,
        password: 'password123',
      };

      const result = await authClient.signIn(credentials);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockAuthIdentity);
      }
      expect(mockInternalAuthClient.signInWithPassword).toHaveBeenCalledWith(
        credentials,
      );
    });

    it('should return error on failure', async () => {
      const errorMessage = 'test error';
      mockMethodFailure(
        mockInternalAuthClient.signInWithPassword as jest.Mock,
        errorMessage,
      );

      const result = await authClient.signIn({
        email: 'test@example.com',
        password: 'wrong',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(errorMessage);
      }
    });
  });

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      mockMethodSuccess(mockInternalAuthClient.signOut as jest.Mock, null);

      const result = await authClient.signOut();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
      expect(mockInternalAuthClient.signOut).toHaveBeenCalledTimes(1);
    });

    it('should return error on failure', async () => {
      const errorMessage = 'test error';
      mockMethodFailure(
        mockInternalAuthClient.signOut as jest.Mock,
        errorMessage,
      );

      const result = await authClient.signOut();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(errorMessage);
      }
    });
  });

  describe('signUp', () => {
    it('should sign up user successfully', async () => {
      const mockAuthIdentity = createMockAuthIdentity();
      mockMethodSuccess(
        mockInternalAuthClient.signUp as jest.Mock,
        mockAuthIdentity,
      );
      const credentials = {
        email: mockAuthIdentity.email,
        password: 'password123',
      };
      const options = { emailRedirectTo: 'https://example.com/confirm' };

      const result = await authClient.signUp(credentials, options);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockAuthIdentity);
      }
      expect(mockInternalAuthClient.signUp).toHaveBeenCalledWith({
        ...credentials,
        options,
      });
    });

    it('should return error on failure', async () => {
      const errorMessage = 'test error';
      mockMethodFailure(
        mockInternalAuthClient.signUp as jest.Mock,
        errorMessage,
      );

      const result = await authClient.signUp({
        email: 'existing@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(errorMessage);
      }
    });
  });

  describe('resetPassword', () => {
    it('should send reset password email', async () => {
      const mockAuthIdentity = createMockAuthIdentity();
      mockMethodSuccess(
        mockInternalAuthClient.resetPasswordForEmail as jest.Mock,
        mockAuthIdentity,
      );
      const email = mockAuthIdentity.email;
      const options = { redirectTo: 'https://example.com/reset' };

      const result = await authClient.resetPassword({
        email,
        options,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
      expect(mockInternalAuthClient.resetPasswordForEmail).toHaveBeenCalledWith(
        email,
        options,
      );
    });

    it('should return error on failure', async () => {
      const errorMessage = 'test error';
      mockMethodFailure(
        mockInternalAuthClient.resetPasswordForEmail as jest.Mock,
        errorMessage,
      );

      const result = await authClient.resetPassword({
        email: 'nonexistent@example.com',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toEqual(errorMessage);
      }
    });
  });

  describe('changePassword', () => {
    it('should update user password', async () => {
      const mockAuthIdentity = createMockAuthIdentity();
      mockMethodSuccess(
        mockInternalAuthClient.updateUser as jest.Mock,
        mockAuthIdentity,
      );
      const password = 'newPassword123';
      const options = { emailRedirectTo: 'https://example.com/reset' };

      const result = await authClient.changePassword({ password, options });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockAuthIdentity);
      }
      expect(mockInternalAuthClient.updateUser).toHaveBeenCalledWith(
        { password },
        options,
      );
    });

    it('should return error on failure', async () => {
      const errorMessage = 'test error';
      mockMethodFailure(
        mockInternalAuthClient.updateUser as jest.Mock,
        errorMessage,
      );

      const result = await authClient.changePassword({ password: '123' });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(errorMessage);
      }
    });
  });

  describe('verifyOtp', () => {
    it('should verify OTP successfully', async () => {
      const mockAuthIdentity = createMockAuthIdentity();
      mockMethodSuccess(
        mockInternalAuthClient.verifyOtp as jest.Mock,
        mockAuthIdentity,
      );

      const result = await authClient.verifyOtp({
        type: 'email',
        token_hash: 'abc123',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockAuthIdentity);
      }
      expect(mockInternalAuthClient.verifyOtp).toHaveBeenCalledWith({
        type: 'email',
        token_hash: 'abc123',
      });
    });

    it('should return error on failure', async () => {
      const errorMessage = 'test error';
      mockMethodFailure(
        mockInternalAuthClient.verifyOtp as jest.Mock,
        errorMessage,
      );

      const result = await authClient.verifyOtp({
        type: 'email',
        token_hash: 'invalid',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(errorMessage);
      }
    });
  });

  describe('exchangeCodeForSession', () => {
    it('should exchange code for session', async () => {
      const mockAuthIdentity = createMockAuthIdentity();
      mockMethodSuccess(
        mockInternalAuthClient.exchangeCodeForSession as jest.Mock,
        mockAuthIdentity,
      );
      const code = 'code123';

      const result = await authClient.exchangeCodeForSession(code);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockAuthIdentity);
      }
      expect(
        mockInternalAuthClient.exchangeCodeForSession,
      ).toHaveBeenCalledWith(code);
    });

    it('should return error on failure', async () => {
      const errorMessage = 'test error';
      mockMethodFailure(
        mockInternalAuthClient.exchangeCodeForSession as jest.Mock,
        errorMessage,
      );

      const result = await authClient.exchangeCodeForSession('invalid');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(errorMessage);
      }
    });
  });

  describe('signInWithOAuth', () => {
    it('should initiate OAuth sign in', async () => {
      mockMethodSuccess(
        mockInternalAuthClient.signInWithOAuth as jest.Mock,
        null,
      );
      const contract = {
        provider: 'google' as Provider,
        options: { redirectTo: 'https://example.com/callback' },
      };

      const result = await authClient.signInWithOAuth(contract);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
      expect(mockInternalAuthClient.signInWithOAuth).toHaveBeenCalledWith(
        contract,
      );
    });

    it('should return error on failure', async () => {
      const errorMessage = 'test error';
      mockMethodFailure(
        mockInternalAuthClient.signInWithOAuth as jest.Mock,
        errorMessage,
      );

      const result = await authClient.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: 'https://example.com/callback' },
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(errorMessage);
      }
    });
  });

  describe('sendConfirmationEmail', () => {
    it('should resend confirmation email', async () => {
      const mockAuthIdentity = createMockAuthIdentity();
      mockMethodSuccess(
        mockInternalAuthClient.resend as jest.Mock,
        mockAuthIdentity,
      );
      const email = mockAuthIdentity.email;
      const redirectTo = 'https://example.com/confirm';

      const result = await authClient.sendConfirmationEmail({
        email,
        redirectTo,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
      expect(mockInternalAuthClient.resend).toHaveBeenCalledWith({
        type: 'signup',
        email,
        options: { emailRedirectTo: redirectTo },
      });
    });

    it('should return error on failure', async () => {
      const errorMessage = 'test error';
      mockMethodFailure(
        mockInternalAuthClient.resend as jest.Mock,
        errorMessage,
      );

      const result = await authClient.sendConfirmationEmail({
        email: 'test@example.com',
        redirectTo: 'https://example.com/confirm',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toEqual(errorMessage);
      }
    });
  });
});
