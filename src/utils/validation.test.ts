import { EMAIL_REGEXP } from '@/auth/credentials/application/validation/email.schema';

import { correctEmails, wrongEmails } from './validation';

describe('Email Validation RegExp', () => {
  it('should match valid email address', () => {
    correctEmails.forEach((email) =>
      expect(EMAIL_REGEXP.test(email)).toBeTruthy(),
    );
  });

  it('should not match invalid email address', () => {
    wrongEmails.forEach((email) =>
      expect(EMAIL_REGEXP.test(email)).toBeFalsy(),
    );
  });
});
