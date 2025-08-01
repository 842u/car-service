import { render, screen } from '@testing-library/react';

import { SPINNER_TEST_ID } from '@/ui/decorative/spinner/spinner';

import { Form } from '../../form';
import type { FormSubmitButtonProps } from './submit-button';
import { FormSubmitButton } from './submit-button';

function TestFormButtonSubmit({ children, ...props }: FormSubmitButtonProps) {
  return (
    <Form>
      <FormSubmitButton {...props}>{children}</FormSubmitButton>
    </Form>
  );
}

describe('FormButtonSubmit', () => {
  it('should throw if not wrapped in Form', () => {
    const buttonText = 'test';

    expect(() =>
      render(<FormSubmitButton>{buttonText}</FormSubmitButton>),
    ).toThrow();
  });

  it('should render as a button element', () => {
    const buttonText = 'test';
    render(<TestFormButtonSubmit>{buttonText}</TestFormButtonSubmit>);

    const buttonElement = screen.getByRole('button', { name: buttonText });

    expect(buttonElement).toBeInTheDocument();
  });

  it('should render a loading spinner while isSubmitting', () => {
    const buttonText = 'test';
    render(
      <TestFormButtonSubmit isSubmitting>{buttonText}</TestFormButtonSubmit>,
    );

    const loadingSpinner = screen.getByTestId(SPINNER_TEST_ID);

    expect(loadingSpinner).toBeInTheDocument();
  });

  it('should render as type="submit"', () => {
    const buttonText = 'test';
    render(<TestFormButtonSubmit>{buttonText}</TestFormButtonSubmit>);

    const buttonElement = screen.getByRole('button', { name: buttonText });

    expect(buttonElement).toHaveAttribute('type', 'submit');
  });
});
