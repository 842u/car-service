/**
 * Temporary coupling to Supabase authentication types.
 *
 * While this creates a dependency on infrastructure, it is a pragmatic choice
 * for the current stage.
 */

import type { User } from '@supabase/supabase-js';

/**
 * Distinguish these types to avoid confusion with domain User type.
 */
// eslint-disable-next-line
export interface AuthIdentityPersistence extends User {}
