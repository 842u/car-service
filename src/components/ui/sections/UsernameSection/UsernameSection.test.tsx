import { render, screen } from '@testing-library/react';

import { TanStackQueryProvider } from '@/features/common/providers/TanStackQueryProvider';
import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from '@/schemas/zod/common';

import { USERNAME_FORM_TEST_ID } from '../../forms/UsernameForm/UsernameForm';
import { UsernameSection } from './UsernameSection';

function TestUsernameSection() {
  return (
    <TanStackQueryProvider>
      <UsernameSection />
    </TanStackQueryProvider>
  );
}

describe('UsernameSection', () => {
  it('should render a heading', () => {
    render(<TestUsernameSection />);

    const heading = screen.getByRole('heading', { name: 'Username' });

    expect(heading).toBeInTheDocument();
  });

  it('should render usage info', () => {
    render(<TestUsernameSection />);

    const usageInfo = screen.getByText(
      'Please enter your full name, or a display name you are comfortable with.',
    );

    expect(usageInfo).toBeInTheDocument();
  });

  it('should render username constraints info', () => {
    render(<TestUsernameSection />);

    const usernameConstraintsInfo = screen.getByText(
      `Letters, numbers and single whitespaces allowed. Length between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters.`,
    );

    expect(usernameConstraintsInfo).toBeInTheDocument();
  });

  it('should render username form', () => {
    render(<TestUsernameSection />);

    const usernameForm = screen.getByTestId(USERNAME_FORM_TEST_ID);

    expect(usernameForm).toBeInTheDocument();
  });
});
