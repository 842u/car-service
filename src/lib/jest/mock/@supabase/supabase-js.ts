import { createMockSupabaseClient } from '@/lib/jest/mock/@supabase/client';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => createMockSupabaseClient()),
}));
