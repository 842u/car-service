import { render, screen } from '@testing-library/react';

import { Form } from '../form';
import { FormInput, FormInputProps } from './input';

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
});
