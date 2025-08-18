import type { Result } from '@/common/interface/result/result';
import type { CredentialsDto } from '@/user/application/dtos/credentials/credentials.dto';

type Data = { id: string };

type Error = { message: string };

type AuthApiServiceResult = Result<Data, Error>;

export interface AuthApiService {
  signUp(credentials: CredentialsDto): Promise<AuthApiServiceResult>;
  signIn(credentials: CredentialsDto): Promise<AuthApiServiceResult>;
}
