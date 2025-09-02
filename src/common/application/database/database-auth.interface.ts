import type { DatabaseClientResult } from '@/common/application/database/database-client.interface';
import type { SignInContract } from '@/user/interface/contracts/sign-in.schema';
import type { SignUpContract } from '@/user/interface/contracts/sign-up.schema';

export interface DatabaseAuth {
  getUser(): Promise<DatabaseClientResult>;
  signIn(contract: SignInContract): Promise<DatabaseClientResult>;
  signOut(): Promise<DatabaseClientResult>;
  signUp(contract: SignUpContract): Promise<DatabaseClientResult>;
  resetPassword(contract: {
    email: string;
    options?: {
      redirectTo?: string;
    };
  }): Promise<DatabaseClientResult>;
  updateUser(contract: {
    attributes: { password: string };
    options?: {
      emailRedirectTo?: string;
    };
  }): Promise<DatabaseClientResult>;
  verifyOtp(contract: {
    type: string;
    token_hash: string;
  }): Promise<DatabaseClientResult>;
  exchangeCodeForSession(code: string): Promise<DatabaseClientResult>;
  signInWithOAuth(contract: {
    provider: string;
    options: { redirectTo: string };
  }): Promise<DatabaseClientResult>;
  admin: DatabaseAuthAdmin;
}

export interface DatabaseAuthAdmin {
  createUser(contract: {
    email: string;
    password: string;
    email_confirm: boolean;
  }): Promise<DatabaseClientResult>;
}
