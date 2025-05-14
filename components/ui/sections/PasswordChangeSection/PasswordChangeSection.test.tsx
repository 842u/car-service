import { render, screen } from '@testing-library/react';

import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '@/schemas/zod/common';

import { PASSWORD_CHANGE_FORM_TEST_ID } from '../../forms/PasswordChangeForm/PasswordChangeForm';
import { PasswordChangeSection } from './PasswordChangeSection';

describe('PasswordChangeSection', () => {
  it('should render a heading', () => {
    render(<PasswordChangeSection />);

    const heading = screen.getByRole('heading', { name: 'Change Password' });

    expect(heading).toBeInTheDocument();
  });

  it('should render section info', () => {
    render(<PasswordChangeSection />);

    const sectionInfo = screen.getByText(
      'Update your current password to keep your account secure.',
    );

    expect(sectionInfo).toBeInTheDocument();
  });

  it('should render info about password constraints', () => {
    render(<PasswordChangeSection />);

    const passwordConstraintInfo = screen.getByText(
      `Length must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters.`,
    );

    expect(passwordConstraintInfo).toBeInTheDocument();
  });

  it('should render password change form', () => {
    render(<PasswordChangeSection />);

    const passwordChangeForm = screen.getByTestId(PASSWORD_CHANGE_FORM_TEST_ID);

    expect(passwordChangeForm).toBeInTheDocument();
  });
});
