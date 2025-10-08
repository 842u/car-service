/**
 * Temporary coupling to Supabase authentication types.
 *
 * While this creates a dependency on infrastructure, it is a pragmatic choice
 * for the current stage.
 */

import type { User } from '@supabase/supabase-js';

export type AuthIdentityPersistence = User;
