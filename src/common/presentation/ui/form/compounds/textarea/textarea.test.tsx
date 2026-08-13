import { render, screen } from '@testing-library/react';

import { Form } from '../../form';
import type { TextareaProps } from './textarea';
import { Textarea } from './textarea';

// eslint-disable-next-line
function TestTextarea({ ...props }: TextareaProps<any>) {
  return (
    <Form>
      <Textarea {...props} />
    </Form>
  );
}

describe('Textarea', () => {
  it('should throw if not wrapped in Form', () => {
    const labelText = 'testLabel';
    const name = 'testName';

    expect(() => render(<Textarea label={labelText} name={name} />)).toThrow();
  });

  it('should render as a textarea element', () => {
    const labelText = 'testLabel';
    const name = 'testName';
    render(<TestTextarea label={labelText} name={name} />);

    const textareaElement = screen.getByRole('textbox', { name: labelText });

    expect(textareaElement).toBeInTheDocument();
  });

  it('should render provided label text', () => {
    const labelText = 'testLabel';
    const name = 'testName';
    render(<TestTextarea label={labelText} name={name} />);

    const label = screen.getByLabelText(labelText);

    expect(label).toBeInTheDocument();
  });

  it('should render error message if showErrorMessage and errorMessage', () => {
    const errorMessage = 'testError';
    const labelText = 'testLabel';
    const name = 'testName';
    render(
      <TestTextarea
        errorMessage={errorMessage}
        label={labelText}
        name={name}
        showErrorMessage={true}
      />,
    );

    const error = screen.getByText(errorMessage);

    expect(error).toBeInTheDocument();
  });

  it('should mark the textarea invalid and describe it by the error text when errorMessage is set', () => {
    const errorMessage = 'testError';
    const labelText = 'testLabel';
    const name = 'testName';
    render(
      <TestTextarea
        errorMessage={errorMessage}
        label={labelText}
        name={name}
      />,
    );

    const textareaElement = screen.getByRole('textbox');
    const error = screen.getByText(errorMessage);

    expect(textareaElement).toHaveAttribute('aria-invalid', 'true');
    expect(textareaElement).toHaveAttribute('aria-describedby', error.id);
  });

  it('should not mark the textarea invalid or describe it when there is no errorMessage', () => {
    const labelText = 'testLabel';
    const name = 'testName';
    render(<TestTextarea label={labelText} name={name} />);

    const textareaElement = screen.getByRole('textbox', { name: labelText });

    expect(textareaElement).not.toHaveAttribute('aria-invalid');
    expect(textareaElement).not.toHaveAttribute('aria-describedby');
  });

  it('should not describe the textarea when errorMessage is set but showErrorMessage is false', () => {
    const errorMessage = 'testError';
    const labelText = 'testLabel';
    const name = 'testName';
    render(
      <TestTextarea
        errorMessage={errorMessage}
        label={labelText}
        name={name}
        showErrorMessage={false}
      />,
    );

    const textareaElement = screen.getByRole('textbox', { name: labelText });

    expect(textareaElement).toHaveAttribute('aria-invalid', 'true');
    expect(textareaElement).not.toHaveAttribute('aria-describedby');
  });

  it('should reach the textarea element with the required attribute', () => {
    const labelText = 'testLabel';
    const name = 'testName';
    render(<TestTextarea label={labelText} name={name} required={true} />);

    const textareaElement = screen.getByRole('textbox');

    expect(textareaElement).toBeRequired();
  });
});
