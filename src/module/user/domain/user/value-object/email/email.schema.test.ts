import { correctEmails, wrongEmails } from './email.samples';
import { EMAIL_REGEXP } from './email.schema';

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
