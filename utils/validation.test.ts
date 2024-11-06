import { EMAIL_VALIDATION_REGEXP } from './validation';

export const correctEmails = [
  'john.doe@example.com',
  'jane_smith123@mail.org',
  'firstname.lastname@company.co',
  'contact@domain.co.uk',
  'username123@gmail.com',
  'name@domain123.com',
  'info@mywebsite.org',
  'support@service.com',
  'user.name@web-service.net',
  'admin@site.com',
  'user@company.email',
  'name.last@domain.com',
  'user.name@education.edu',
  'my.email@subdomain.domain.com',
  'example_user@domain.info',
  'hello.world@domain.travel',
  'user@my-domain.com',
];

export const wrongEmails = [
  'plainaddress',
  '@missingusername.com',
  'username@.com',
  'username@domain..com',
  'username@domain.c',
  'username@domain,com',
  'username@domain@domain.com',
  'username@-domain.com',
  'username@domain.com.',
  'username@domain.c#om',
  'username@domain..com',
  'username@.com',
  '@domain.com',
  'username@domain..com',
  'username@domain,com',
  'username@domain..com',
  'user name@domain.com',
  'username@domain.c@om',
  'username@domain..com',
  'username@domain.c#om',
  'username@domain..com',
];

describe('Email Validation RegExp', () => {
  it('should match valid email address', () => {
    correctEmails.forEach((email) =>
      expect(EMAIL_VALIDATION_REGEXP.test(email)).toBeTruthy(),
    );
  });

  it('should not match invalid email address', () => {
    wrongEmails.forEach((email) =>
      expect(EMAIL_VALIDATION_REGEXP.test(email)).toBeFalsy(),
    );
  });
});
