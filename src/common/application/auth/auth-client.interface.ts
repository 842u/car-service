import type { Result } from '@/common/interface/result/result';
import type { SignInContract } from '@/user/interface/contracts/sign-in.schema';
import type { SignUpContract } from '@/user/interface/contracts/sign-up.schema';

type AuthError = {
  message: string;
  code?: string;
};

export type AuthClientResult<T = unknown> = Result<T, AuthError>;

export interface AuthClient {
  getSession(): Promise<AuthClientResult>;
  signIn(contract: SignInContract): Promise<AuthClientResult>;
  signOut(): Promise<AuthClientResult>;
  signUp(contract: SignUpContract): Promise<AuthClientResult>;
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
  admin: AuthAdminClient;
}

export interface AuthAdminClient {
  createUser(contract: {
    email: string;
    password: string;
    email_confirm: boolean;
  }): Promise<AuthClientResult>;
}
