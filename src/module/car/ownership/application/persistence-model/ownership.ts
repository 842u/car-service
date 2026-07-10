/**
 * Temporary coupling to Supabase types.
 *
 * While this creates a dependency on infrastructure, it is a pragmatic choice
 * for the current stage.
 */

import type { Database } from 'supabase/types/supabase';

export type OwnershipPersistence =
  Database['public']['Tables']['cars_ownerships']['Row'];

export type OwnershipInsertPersistence =
  Database['public']['Tables']['cars_ownerships']['Insert'];
