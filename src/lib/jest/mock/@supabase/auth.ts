export function createMockSupabaseAuthModule() {
  return {
    auth: {
      getUser: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      signUp: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn(),
      verifyOtp: jest.fn(),
      exchangeCodeForSession: jest.fn(),
      signInWithOAuth: jest.fn(),
      resend: jest.fn(),
      admin: {
        createUser: jest.fn(),
        deleteUser: jest.fn(),
      },
    },
  };
}
