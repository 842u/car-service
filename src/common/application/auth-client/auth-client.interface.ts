import type { Result } from '@/common/application/result/result';

type AuthError = {
  message: string;
  code: string;
  status: number | undefined;
};

type AuthClientResult<T> = Result<T, AuthError>;

export interface AuthClient<T> {
  getSession(): Promise<AuthClientResult<T>>;
  signIn(contract: {
    email: string;
    password: string;
  }): Promise<AuthClientResult<T>>;
  signOut(): Promise<AuthClientResult<null>>;
  signUp(contract: {
    email: string;
    password: string;
  }): Promise<AuthClientResult<T>>;
  resetPassword(contract: {
    email: string;
    options?: {
      redirectTo?: string;
    };
  }): Promise<AuthClientResult<null>>;
  updateUser(contract: {
    attributes: { password: string };
    options?: {
      emailRedirectTo?: string;
    };
  }): Promise<AuthClientResult<T>>;
  verifyOtp(contract: {
    type: string;
    token_hash: string;
  }): Promise<AuthClientResult<T>>;
  exchangeCodeForSession(code: string): Promise<AuthClientResult<T>>;
  signInWithOAuth(contract: {
    provider: string;
    options: { redirectTo: string };
  }): Promise<AuthClientResult<null>>;
  sendConfirmationEmail(contract: {
    email: string;
    redirectTo: string;
  }): Promise<AuthClientResult<null>>;
}

export interface AuthAdminClient<T> extends AuthClient<T> {
  createUser(contract: {
    email: string;
    password: string;
    email_confirm: boolean;
  }): Promise<AuthClientResult<T>>;
  deleteUser(contract: { id: string }): Promise<AuthClientResult<T>>;
}
