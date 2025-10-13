import { createMockSupabaseClient } from '@/lib/jest/mock/@supabase/client';

jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(() => createMockSupabaseClient()),
  createServerClient: jest.fn(() => createMockSupabaseClient()),
}));
