import { adminAuthClient } from '@/dependencies/auth-client/admin';
import { adminDatabaseClient } from '@/dependencies/database-client/admin';

const testUserEmail = process.env.SUPABASE_TEST_USER_EMAIL!;
const testUserPassword = process.env.SUPABASE_TEST_USER_PASSWORD!;

export async function createTestUser(testUserIndex: number) {
  const email = testUserIndex + testUserEmail;
  const password = testUserPassword;

  const createUserResult = await adminAuthClient.createUser({
    email: testUserIndex + testUserEmail,
    password: testUserPassword,
    email_confirm: true,
  });

  if (!createUserResult.success) {
    const { message } = createUserResult.error;
    throw new Error(`Error on creating test user: ${message}.`);
  }

  return { email, password };
}

export async function deleteTestUser(testUserIndex: number) {
  const rpcResult = await adminDatabaseClient.rpc(async (rpc) =>
    rpc('delete_test_user', {
      test_user_index: testUserIndex,
    }),
  );

  if (!rpcResult.success) {
    const { message, code } = rpcResult.error;
    throw new Error(`Error on deleting test user: ${message}, code: ${code}.`);
  }
}
