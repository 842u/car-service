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

  it('should be enabled by default', () => {
    const buttonText = 'some text';
    render(<SubmitButton>{buttonText}</SubmitButton>);

    const button = screen.getByRole('button', { name: buttonText });

    expect(button).toBeEnabled();
  });

  it('should be disabled while disabled prop is true', () => {
    const buttonText = 'some text';
    render(<SubmitButton disabled>{buttonText}</SubmitButton>);

    const button = screen.getByRole('button', { name: buttonText });

    expect(button).toBeDisabled();
  });

  it('should be enabled while disabled prop is false', () => {
    const buttonText = 'some text';
    render(<SubmitButton disabled={false}>{buttonText}</SubmitButton>);

    const button = screen.getByRole('button', { name: buttonText });

    expect(button).toBeEnabled();
  });
});
