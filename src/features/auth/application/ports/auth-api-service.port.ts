import type { Result } from '@/common/interface/result/result';

type Data = { id: string };

type Error = { message: string };

type AuthApiServiceResult = Result<Data, Error>;

export type Credentials = {
  email: string;
  password: string;
};

export interface AuthApiService {
  signUp(credentials: Credentials): Promise<AuthApiServiceResult>;
}
