import type { CredentialsDto } from '@/auth/application/dtos/credentials/credentials.dto';
import type { Result } from '@/common/interface/result/result';

type Data = { id: string };

type Error = { message: string };

type AuthApiServiceResult = Result<Data, Error>;

export interface AuthApiService {
  signUp(credentials: CredentialsDto): Promise<AuthApiServiceResult>;
  signIn(credentials: CredentialsDto): Promise<AuthApiServiceResult>;
}
