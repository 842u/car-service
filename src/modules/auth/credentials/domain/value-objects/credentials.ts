import { Email } from '@/auth/credentials/domain/value-objects/email/email';
import { Password } from '@/auth/credentials/domain/value-objects/password/password';
import { Result } from '@/common/interface/result/result';

export class Credentials {
  private constructor(
    private readonly _email: Email,
    private readonly _password: Password,
  ) {}

  static create(email: string, password: string) {
    const emailResult = Email.create(email);

    if (!emailResult.success) {
      return Result.fail(emailResult.error);
    }

    const passwordResult = Password.create(password);

    if (!passwordResult.success) {
      return Result.fail(passwordResult.error);
    }

    return Result.ok(new Credentials(emailResult.data, passwordResult.data));
  }

  get email(): Email {
    return this._email;
  }

  get password(): Password {
    return this._password;
  }
}
