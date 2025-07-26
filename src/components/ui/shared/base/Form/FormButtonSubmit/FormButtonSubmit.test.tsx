import { render, screen } from '@testing-library/react';

import { SPINNER_TEST_ID } from '@/features/common/ui/decorative/Spinner/Spinner';

import { Form } from '../Form';
import { FormButtonSubmit, FormButtonSubmitProps } from './FormButtonSubmit';

function TestFormButtonSubmit({ children, ...props }: FormButtonSubmitProps) {
  return (
    <Form>
      <FormButtonSubmit {...props}>{children}</FormButtonSubmit>
    </Form>
  );
}

describe('FormButtonSubmit', () => {
  it('should throw if not wrapped in Form', () => {
    const buttonText = 'test';

    expect(() =>
      render(<FormButtonSubmit>{buttonText}</FormButtonSubmit>),
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
