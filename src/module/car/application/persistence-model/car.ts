/**
 * Temporary coupling to Supabase types.
 *
 * While this creates a dependency on infrastructure, it is a pragmatic choice
 * for the current stage.
 */

import type { Database } from 'supabase/types/supabase';

export type CarPersistence = Database['public']['Tables']['cars']['Row'];
