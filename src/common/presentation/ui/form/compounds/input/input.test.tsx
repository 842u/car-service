import { render, screen } from '@testing-library/react';

import { Form } from '../../form';
import type { FormInputProps } from './input';
import { FormInput } from './input';

// eslint-disable-next-line
function TestFormInput({ ...props }: FormInputProps<any>) {
  return (
    <Form>
      <FormInput {...props} />
    </Form>
  );
}

describe('FormInput', () => {
  it('should throw if not wrapped in Form', () => {
    const labelText = 'testLabel';
    const name = 'testName';

    expect(() =>
      render(<FormInput label={labelText} name={name} type="text" />),
    ).toThrow();
  });

  it('should render as a input element', () => {
    const labelText = 'testLabel';
    const name = 'testName';
    render(<TestFormInput label={labelText} name={name} type="text" />);

    const inputElement = screen.getByRole('textbox', { name: labelText });

    expect(inputElement).toBeInTheDocument();
  });

  it('should render provided label text', () => {
    const labelText = 'testLabel';
    const name = 'testName';
    render(<TestFormInput label={labelText} name={name} type="text" />);

    const label = screen.getByLabelText(labelText);

    expect(label).toBeInTheDocument();
  });

  it('should render error message if showErrorMessage and errorMessage', () => {
    const errorMessage = 'testError';
    const labelText = 'testLabel';
    const name = 'testName';
    render(
      <TestFormInput
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

  it('should mark the input invalid and describe it by the error text when errorMessage is set', () => {
    const errorMessage = 'testError';
    const labelText = 'testLabel';
    const name = 'testName';
    render(
      <TestFormInput
        errorMessage={errorMessage}
        label={labelText}
        name={name}
        type="text"
      />,
    );

    const inputElement = screen.getByRole('textbox');
    const error = screen.getByText(errorMessage);

    expect(inputElement).toHaveAttribute('aria-invalid', 'true');
    expect(inputElement).toHaveAttribute('aria-describedby', error.id);
  });

  it('should not mark the input invalid or describe it when there is no errorMessage', () => {
    const labelText = 'testLabel';
    const name = 'testName';
    render(<TestFormInput label={labelText} name={name} type="text" />);

    const inputElement = screen.getByRole('textbox', { name: labelText });

    expect(inputElement).not.toHaveAttribute('aria-invalid');
    expect(inputElement).not.toHaveAttribute('aria-describedby');
  });

  it('should not describe the input when errorMessage is set but showErrorMessage is false', () => {
    const errorMessage = 'testError';
    const labelText = 'testLabel';
    const name = 'testName';
    render(
      <TestFormInput
        errorMessage={errorMessage}
        label={labelText}
        name={name}
        showErrorMessage={false}
        type="text"
      />,
    );

    const inputElement = screen.getByRole('textbox', { name: labelText });

    expect(inputElement).toHaveAttribute('aria-invalid', 'true');
    expect(inputElement).not.toHaveAttribute('aria-describedby');
  });

  it('should reach the input element with the required attribute', () => {
    const labelText = 'testLabel';
    const name = 'testName';
    render(
      <TestFormInput
        label={labelText}
        name={name}
        required={true}
        type="text"
      />,
    );

    const inputElement = screen.getByRole('textbox');

    expect(inputElement).toBeRequired();
  });
});
