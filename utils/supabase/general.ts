import { createClient } from './client';

const supabaseAppUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const testUserEmail = process.env.SUPABASE_TEST_USER_EMAIL!;
const testUserPassword = process.env.SUPABASE_TEST_USER_PASSWORD!;

export async function createTestUser(testUserIndex: number) {
  const supabase = createClient(supabaseAppUrl, supabaseServiceRoleKey);
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
