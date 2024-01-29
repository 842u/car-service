import { render, screen } from '@testing-library/react';

import { SubmitButton } from './SubmitButton';

describe('SubmittButton', () => {
  it('should render a button', () => {
    render(<SubmitButton />);

    const button = screen.getByRole('button', { name: 'submit' });

    expect(button).toBeInTheDocument();
  });

  it('should render a loading spinner while is submitting', () => {
    render(<SubmitButton isSubmitting />);

    const spinner = screen.getByTestId('spinner');

    expect(spinner).toBeInTheDocument();
  });
});
