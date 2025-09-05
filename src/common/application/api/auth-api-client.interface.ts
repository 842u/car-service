import type { Result } from '@/common/interface/result/result';

type Data = { id: string };

type Error = { message: string };

type AuthApiClientResult = Result<Data, Error>;

export interface AuthApiClient {
  signUp(contract: unknown): Promise<AuthApiClientResult>;
  signIn(contract: unknown): Promise<AuthApiClientResult>;
  passwordChange(contract: unknown): Promise<AuthApiClientResult>;
}
