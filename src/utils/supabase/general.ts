import { dependencyContainer, dependencyTokens } from '@/di';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const testUserEmail = process.env.SUPABASE_TEST_USER_EMAIL!;
const testUserPassword = process.env.SUPABASE_TEST_USER_PASSWORD!;

export async function createTestUser(testUserIndex: number) {
  const email = testUserIndex + testUserEmail;
  const password = testUserPassword;

  const authAdminClient = await dependencyContainer.resolve(
    dependencyTokens.AUTH_ADMIN_CLIENT,
    { supabaseKey, supabaseUrl },
  );

  const createUserResult = await authAdminClient.createUser({
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
  const dbClient = await dependencyContainer.resolve(
    dependencyTokens.DATABASE_BROWSER_CLIENT,
    { supabaseKey, supabaseUrl },
  );

  const rpcResult = await dbClient.rpc(async (rpc) =>
    rpc('delete_test_user', {
      test_user_index: testUserIndex,
    }),
  );

  if (!rpcResult.success) {
    const { message, code } = rpcResult.error;
    throw new Error(`Error on deleting test user: ${message}, code: ${code}.`);
  }
}
