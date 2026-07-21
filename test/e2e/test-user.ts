import { adminAuthClient } from '@/dependency/auth-client/admin';
import { adminDatabaseClient } from '@/dependency/database-client/admin';

const testUserPassword = process.env.SUPABASE_TEST_USER_PASSWORD!;

export function generateTestEmail() {
  const [, domain] = process.env.SUPABASE_TEST_USER_EMAIL!.split('@');
  return `${crypto.randomUUID()}@${domain}`;
}

export async function createTestUserByEmail(email: string) {
  const createAuthIdentityResult = await adminAuthClient.createAuthIdentity({
    email,
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
      user_name: `test_${email.split('-')[0]}`,
    }),
  );

  if (!createUserResult.success) {
    const { message, code } = createUserResult.error;
    throw new Error(`Error on creating test user: ${message}, code: ${code}.`);
  }
}

export async function deleteTestUserByEmail(email: string) {
  const rpcResult = await adminDatabaseClient.rpc(async (rpc) =>
    rpc('delete_test_user_by_email', { user_email: email }),
  );

  if (!rpcResult.success) {
    const { message, code } = rpcResult.error;
    throw new Error(
      `Error on deleting test user by email: ${message}, code: ${code}.`,
    );
  }
}
