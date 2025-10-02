import type { Result } from '@/common/application/result/result';
import type { SignInApiContract } from '@/user/interface/api/sign-in.schema';
import type { SignUpApiContract } from '@/user/interface/api/sign-up.schema';

type AuthError = {
  message: string;
  code: string;
  status: number | undefined;
};

export type AuthClientResult<T = unknown> = Result<T, AuthError>;

export interface AuthClient {
  getSession(): Promise<AuthClientResult>;
  signIn(contract: SignInApiContract): Promise<AuthClientResult>;
  signOut(): Promise<AuthClientResult>;
  signUp(contract: SignUpApiContract): Promise<AuthClientResult>;
  resetPassword(contract: {
    email: string;
    options?: {
      redirectTo?: string;
    };
  }): Promise<AuthClientResult>;
  updateUser(contract: {
    attributes: { password: string };
    options?: {
      emailRedirectTo?: string;
    };
  }): Promise<AuthClientResult>;
  verifyOtp(contract: {
    type: string;
    token_hash: string;
  }): Promise<AuthClientResult>;
  exchangeCodeForSession(code: string): Promise<AuthClientResult>;
  signInWithOAuth(contract: {
    provider: string;
    options: { redirectTo: string };
  }): Promise<AuthClientResult>;
  sendConfirmationEmail(contract: {
    email: string;
    redirectTo: string;
  }): Promise<AuthClientResult>;
}

export interface AuthAdminClient extends AuthClient {
  createUser(contract: {
    email: string;
    password: string;
    email_confirm: boolean;
  }): Promise<AuthClientResult>;
  deleteUser(contract: { id: string }): Promise<AuthClientResult>;
}
