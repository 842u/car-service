import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'supabase/types/supabase';

import { SupabaseAdminAuthClient } from '@/common/infrastructure/auth-client/supabase-admin';
import {
  createMockAuthIdentity,
  mockMethodFailure,
  mockMethodSuccess,
} from '@/lib/jest/mock/@supabase/auth';

describe('SupabaseAdminAuthClient', () => {
  let mockInternalAdminAuthClient: SupabaseClient<Database>['auth']['admin'];
  let adminAuthClient: SupabaseAdminAuthClient;

  beforeEach(() => {
    jest.clearAllMocks();
    const mockSupabaseClient = createClient('mock-url', 'mock-key');
    mockInternalAdminAuthClient = mockSupabaseClient.auth.admin;
    adminAuthClient = new SupabaseAdminAuthClient(mockSupabaseClient);
  });

  describe('createAuthIdentity', () => {
    it('should create auth identity', async () => {
      const mockAuthIdentity = createMockAuthIdentity();
      mockMethodSuccess(
        mockInternalAdminAuthClient.createUser as jest.Mock,
        mockAuthIdentity,
      );
      const email = mockAuthIdentity.email;
      const password = 'password123';

      const result = await adminAuthClient.createAuthIdentity({
        email,
        password,
        email_confirm: true,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockAuthIdentity);
      }
      expect(mockInternalAdminAuthClient.createUser).toHaveBeenCalledWith({
        email,
        password,
        email_confirm: true,
      });
    });

    it('should return error on failure', async () => {
      const errorMessage = 'test error';
      mockMethodFailure(
        mockInternalAdminAuthClient.createUser as jest.Mock,
        errorMessage,
      );

      const result = await adminAuthClient.createAuthIdentity({
        email: 'test@example.com',
        password: 'password123',
        email_confirm: false,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe(errorMessage);
      }
    });
  });

  describe('deleteAuthIdentity', () => {
    it('should delete auth identity', async () => {
      const mockAuthIdentity = createMockAuthIdentity();
      mockMethodSuccess(
        mockInternalAdminAuthClient.deleteUser as jest.Mock,
        mockAuthIdentity,
      );
      const id = mockAuthIdentity.id;

      const result = await adminAuthClient.deleteAuthIdentity({
        id,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockAuthIdentity);
      }
      expect(mockInternalAdminAuthClient.deleteUser).toHaveBeenCalledWith(id);
    });

    it('should return error on failure', async () => {
      const errorMessage = 'test error';
      mockMethodFailure(
        mockInternalAdminAuthClient.deleteUser as jest.Mock,
        errorMessage,
      );

      const result = await adminAuthClient.deleteAuthIdentity({
        id: 'nonexistent',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toEqual(errorMessage);
      }
    });
  });
});
