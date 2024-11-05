import { createClient } from './client';

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const testUserEmail = process.env.SUPABASE_TEST_USER_EMAIL!;
const testUserPassword = process.env.SUPABASE_TEST_USER_PASSWORD!;

const supabase = createClient(undefined, supabaseServiceRoleKey);

export async function createTestUser() {
  try {
    const { error } = await supabase.auth.admin.createUser({
      email: testUserEmail,
      password: testUserPassword,
      email_confirm: true,
    });
    if (error) throw new Error(error.message);
  } catch (error) {
    if (error instanceof Error)
      throw new Error(error?.message || 'Error on creating test user.');
  }
}

export async function deleteTestUser() {
  try {
    const { status, error } = await supabase.rpc('delete_test_user');
    if ((status < 200 && status >= 300) || error)
      throw new Error(error?.message);
  } catch (error) {
    if (error instanceof Error)
      throw new Error(error?.message || 'Error on deleting test user.');
  }
}
