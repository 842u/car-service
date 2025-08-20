import { ValueObject } from '@/common/domain/value-objects/value-object';
import { Result } from '@/common/interface/result/result';
import { Email } from '@/user/domain/user/value-objects/email/email';
import { Password } from '@/user/domain/user/value-objects/password/password';

type CredentialsValue = {
  email: Email;
  password: Password;
};

export class Credentials extends ValueObject<CredentialsValue> {
  private constructor(value: CredentialsValue) {
    super(value);
  }

  static create(email: string, password: string) {
    const emailResult = Email.create(email);

    if (!emailResult.success) {
      return Result.fail(emailResult.error);
    }

    const passwordResult = Password.create(password);

    if (!passwordResult.success) {
      return Result.fail(passwordResult.error);
    }

    return Result.ok(
      new Credentials({
        email: emailResult.data,
        password: passwordResult.data,
      }),
    );
  }

  get email(): Email {
    return this._value.email;
  }

  get password(): Password {
    return this._value.password;
  }
}
