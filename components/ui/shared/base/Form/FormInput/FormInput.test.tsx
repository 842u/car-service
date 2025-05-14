import { render, screen } from '@testing-library/react';

import { FormInput } from './FormInput';

describe('FormInput', () => {
  it('should render as a input element', () => {
    const labelText = 'testLabel';
    const name = 'testName';
    render(<FormInput label={labelText} name={name} type="text" />);

    const inputElement = screen.getByRole('textbox', { name: labelText });

    expect(inputElement).toBeInTheDocument();
  });

  it('should render provided label text', () => {
    const labelText = 'testLabel';
    const name = 'testName';
    render(<FormInput label={labelText} name={name} type="text" />);

    const label = screen.getByLabelText(labelText);

    expect(label).toBeInTheDocument();
  });

  it('should render error message if showErrorMessage and errorMessage', () => {
    const errorMessage = 'testError';
    const labelText = 'testLabel';
    const name = 'testName';
    render(
      <FormInput
        errorMessage={errorMessage}
        label={labelText}
        name={name}
        showErrorMessage={true}
        type="text"
      />,
    );

    const error = screen.getByText(errorMessage);

    expect(error).toBeInTheDocument();
  });
});
