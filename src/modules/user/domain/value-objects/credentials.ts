import { ValueObject } from '@/common/domain/value-objects/value-object';
import { Result } from '@/common/interface/result/result';
import { Email } from '@/user/domain/value-objects/email/email';
import { Password } from '@/user/domain/value-objects/password/password';

type CredentialsValue = {
  email: Email;
  password: Password;
};

export class Credentials extends ValueObject {
  private readonly _value: CredentialsValue;

  private constructor(email: Email, password: Password) {
    super();
    this._value = {
      email,
      password,
    };
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

    return Result.ok(new Credentials(emailResult.data, passwordResult.data));
  }

  get value(): CredentialsValue {
    return this._value;
  }

  get email(): Email {
    return this._value.email;
  }

  get password(): Password {
    return this._value.password;
  }
}
