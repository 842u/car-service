import { render, screen } from '@testing-library/react';

import { SubmitButton } from './SubmitButton';

describe('SubmittButton', () => {
  it('should render a button', () => {
    const buttonText = 'some text';

    render(<SubmitButton>{buttonText}</SubmitButton>);

    const button = screen.getByRole('button', { name: buttonText });

    expect(button).toBeInTheDocument();
  });

  it('should render a loading spinner while is submitting', () => {
    const buttonText = 'some text';

    render(<SubmitButton isSubmitting>{buttonText}</SubmitButton>);

    const spinner = screen.getByTestId('spinner');

    expect(spinner).toBeInTheDocument();
  });
});
