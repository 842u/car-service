import { Provider } from '@supabase/supabase-js';
import { Route } from 'next';

import { createClient } from './client';

const supabaseAppUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const testUserEmail = process.env.SUPABASE_TEST_USER_EMAIL!;
const testUserPassword = process.env.SUPABASE_TEST_USER_PASSWORD!;

export async function createTestUser(testUserIndex: number) {
  const supabase = createClient(supabaseAppUrl, supabaseServiceRoleKey);
  const email = testUserIndex + testUserEmail;
  const password = testUserPassword;

  try {
    const { error } = await supabase.auth.admin.createUser({
      email: testUserIndex + testUserEmail,
      password: testUserPassword,
      email_confirm: true,
    });

    if (error) throw new Error(error.message);
  } catch (error) {
    if (error instanceof Error)
      throw new Error(error?.message || 'Error on creating test user.');
  }

  return { email, password };
}

export async function deleteTestUser(testUserIndex: number) {
  const supabase = createClient(supabaseAppUrl, supabaseServiceRoleKey);
  try {
    const { status, error } = await supabase.rpc('delete_test_user', {
      test_user_index: testUserIndex,
    });
    if ((status < 200 && status >= 300) || error)
      throw new Error(error?.message);
  } catch (error) {
    if (error instanceof Error)
      throw new Error(error?.message || 'Error on deleting test user.');
  }
}

export const fetchUserProfile = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id || '');

  return profileData?.[0];
};

export async function signInWithOAuthHandler(provider: Provider) {
  const { auth } = createClient();
  const requestUrl = new URL(window.location.origin);

  requestUrl.pathname = '/api/auth/callback' satisfies Route;

  const response = await auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: requestUrl.href,
    },
  });

  return response;
}
