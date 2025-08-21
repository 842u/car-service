import type { Result } from '@/common/interface/result/result';

type Data = { id: string };

type Error = { message: string };

type AuthApiServiceResult = Result<Data, Error>;

export interface AuthApiService {
  signUp(contract: unknown): Promise<AuthApiServiceResult>;
  signIn(contract: unknown): Promise<AuthApiServiceResult>;
  passwordChange(contract: unknown): Promise<AuthApiServiceResult>;
}
