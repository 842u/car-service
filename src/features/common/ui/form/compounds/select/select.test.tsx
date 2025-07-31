import { render, screen } from '@testing-library/react';

import { Form } from '../../form';
import { FormSelect, FormSelectProps } from './select';

const MOCK_OPTIONS = {
  option1: 'value1',
  option2: 'value2',
};

// eslint-disable-next-line
function TestFormSelect({ ...props }: FormSelectProps<any>) {
  return (
    <Form>
      <FormSelect {...props} />
    </Form>
  );
}

describe('FormSelect', () => {
  it('should throw if not wrapped in Form', () => {
    const labelText = 'testLabel';
    const name = 'testName';

    expect(() =>
      render(
        <FormSelect label={labelText} name={name} options={MOCK_OPTIONS} />,
      ),
    ).toThrow();
  });

  it('should render as a select element', () => {
    const labelText = 'testLabel';
    const name = 'testName';
    render(
      <TestFormSelect label={labelText} name={name} options={MOCK_OPTIONS} />,
    );

    const selectElement = screen.getByRole('combobox', { name: labelText });

    expect(selectElement).toBeInTheDocument();
  });

  it('should have empty option if hasEmptyOption', () => {
    const labelText = 'testLabel';
    const name = 'testName';
    render(
      <TestFormSelect
        hasEmptyOption={true}
        label={labelText}
        name={name}
        options={MOCK_OPTIONS}
      />,
    );

    const emptyOption = screen.getByRole('option', { name: '' });

    expect(emptyOption).toBeInTheDocument();
  });

  it('should not have empty option if hasEmptyOption', () => {
    const labelText = 'testLabel';
    const name = 'testName';
    render(
      <TestFormSelect
        hasEmptyOption={false}
        label={labelText}
        name={name}
        options={MOCK_OPTIONS}
      />,
    );

    const emptyOption = screen.queryByRole('option', { name: '' });

    expect(emptyOption).not.toBeInTheDocument();
  });

  it('should have provided options', () => {
    const labelText = 'testLabel';
    const name = 'testName';
    render(
      <TestFormSelect label={labelText} name={name} options={MOCK_OPTIONS} />,
    );

    for (const option in MOCK_OPTIONS) {
      const selectOption = screen.getByRole('option', {
        name: option,
      }) as HTMLOptionElement;

      expect(selectOption).toBeInTheDocument();
      expect(selectOption).toHaveValue(
        MOCK_OPTIONS[option as keyof typeof MOCK_OPTIONS],
      );
    }
  });

  it('should render provided label text', () => {
    const labelText = 'testLabel';
    const name = 'testName';
    render(
      <TestFormSelect label={labelText} name={name} options={MOCK_OPTIONS} />,
    );

    const label = screen.getByLabelText(labelText);

    expect(label).toBeInTheDocument();
  });

  it('should render error message if showErrorMessage and errorMessage', () => {
    const labelText = 'testLabel';
    const name = 'testName';
    const errorMessage = 'testError';
    render(
      <TestFormSelect
        errorMessage={errorMessage}
        label={labelText}
        name={name}
        options={MOCK_OPTIONS}
        showErrorMessage={true}
      />,
    );

    const error = screen.getByText(errorMessage);

    expect(error).toBeInTheDocument();
  });
});
