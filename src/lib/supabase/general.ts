import { adminAuthClient } from '@/dependency/auth-client/admin';
import { adminDatabaseClient } from '@/dependency/database-client/admin';

const testUserEmail = process.env.SUPABASE_TEST_USER_EMAIL!;
const testUserPassword = process.env.SUPABASE_TEST_USER_PASSWORD!;

export async function createTestUser(testUserIndex: number) {
  const email = testUserIndex + testUserEmail;
  const password = testUserPassword;

  const createAuthIdentityResult = await adminAuthClient.createAuthIdentity({
    email: testUserIndex + testUserEmail,
    password: testUserPassword,
    email_confirm: true,
  });

  if (!createAuthIdentityResult.success) {
    const { message } = createAuthIdentityResult.error;
    throw new Error(`Error on creating auth identity: ${message}.`);
  }

  const createUserResult = await adminDatabaseClient.query(async (query) =>
    query('users').insert({
      id: createAuthIdentityResult.data.id,
      email,
      user_name: `test_user_${testUserIndex}`,
    }),
  );

  if (!createUserResult.success) {
    const { message, code } = createUserResult.error;
    throw new Error(`Error on creating test user: ${message}, code: ${code}.`);
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
