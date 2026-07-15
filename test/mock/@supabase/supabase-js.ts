import { createMockSupabaseClient } from '@/test/mock/@supabase/client';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => createMockSupabaseClient()),
}));
