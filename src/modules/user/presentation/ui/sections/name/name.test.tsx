import { render, screen } from '@testing-library/react';

import { TanStackQueryProvider } from '@/common/presentation/provider/tan-stack-query';
import {
  MAX_NAME_LENGTH,
  MIN_NAME_LENGTH,
} from '@/user/domain/user/value-objects/name/name.schema';
import { NAME_FORM_TEST_ID } from '@/user/presentation/ui/forms/name/name';

import { NameSection } from './name';

function TestNameSection() {
  return (
    <TanStackQueryProvider>
      <NameSection />
    </TanStackQueryProvider>
  );
}

describe('NameSection', () => {
  it('should render a heading', () => {
    render(<TestNameSection />);

    const heading = screen.getByRole('heading', { name: 'Username' });

    expect(heading).toBeInTheDocument();
  });

  it('should render usage info', () => {
    render(<TestNameSection />);

    const usageInfo = screen.getByText(
      'Please enter your full name, or a display name you are comfortable with.',
    );

    expect(usageInfo).toBeInTheDocument();
  });

  it('should render name constraints info', () => {
    render(<TestNameSection />);

    const nameConstraintsInfo = screen.getByText(
      `Letters, numbers and single whitespaces allowed. Length between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters.`,
    );

    expect(nameConstraintsInfo).toBeInTheDocument();
  });

  it('should render name form', () => {
    render(<TestNameSection />);

    const nameForm = screen.getByTestId(NAME_FORM_TEST_ID);

    expect(nameForm).toBeInTheDocument();
  });
});
