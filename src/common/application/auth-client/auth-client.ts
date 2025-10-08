import type { AuthIdentityPersistence } from '@/common/application/persistence-model/auth-identity';
import type { Result } from '@/common/application/result/result';

type AuthError = {
  message: string;
  code: string;
  status: number | undefined;
};

type AuthClientResult<T> = Result<T, AuthError>;

export interface AuthClient {
  getSession(): Promise<AuthClientResult<AuthIdentityPersistence>>;
  signIn(contract: {
    email: string;
    password: string;
  }): Promise<AuthClientResult<AuthIdentityPersistence>>;
  signOut(): Promise<AuthClientResult<null>>;
  signUp(contract: {
    email: string;
    password: string;
  }): Promise<AuthClientResult<AuthIdentityPersistence>>;
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
  }): Promise<AuthClientResult<AuthIdentityPersistence>>;
  verifyOtp(contract: {
    type: string;
    token_hash: string;
  }): Promise<AuthClientResult<AuthIdentityPersistence>>;
  exchangeCodeForSession(
    code: string,
  ): Promise<AuthClientResult<AuthIdentityPersistence>>;
  signInWithOAuth(contract: {
    provider: string;
    options: { redirectTo: string };
  }): Promise<AuthClientResult<null>>;
  sendConfirmationEmail(contract: {
    email: string;
    redirectTo: string;
  }): Promise<AuthClientResult<null>>;
}

export interface AuthClientAdmin extends AuthClient {
  createUser(contract: {
    email: string;
    password: string;
    email_confirm: boolean;
  }): Promise<AuthClientResult<AuthIdentityPersistence>>;
  deleteUser(contract: {
    id: string;
  }): Promise<AuthClientResult<AuthIdentityPersistence>>;
}
