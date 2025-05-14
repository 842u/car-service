import { render, screen } from '@testing-library/react';

import { SPINNER_TEST_ID } from '@/components/decorative/Spinner/Spinner';

import { FormButtonSubmit } from './FormButtonSubmit';

describe('FormButtonSubmit', () => {
  it('should render as a button element', () => {
    const buttonText = 'test';
    render(<FormButtonSubmit>{buttonText}</FormButtonSubmit>);

    const buttonElement = screen.getByRole('button', { name: buttonText });

    expect(buttonElement).toBeInTheDocument();
  });

  it('should render a loading spinner while isSubmitting', () => {
    const buttonText = 'test';
    render(<FormButtonSubmit isSubmitting>{buttonText}</FormButtonSubmit>);

    const loadingSpinner = screen.getByTestId(SPINNER_TEST_ID);

    expect(loadingSpinner).toBeInTheDocument();
  });

  it('should render as type="submit"', () => {
    const buttonText = 'test';
    render(<FormButtonSubmit>{buttonText}</FormButtonSubmit>);

    const buttonElement = screen.getByRole('button', { name: buttonText });

    expect(buttonElement).toHaveAttribute('type', 'submit');
  });
});
