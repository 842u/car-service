import { render, screen } from '@testing-library/react';

import { Form } from '../../form';
import type { FormCheckboxGroupProps } from './checkbox-group';
import { FormCheckboxGroup } from './checkbox-group';

const MOCK_CHECKBOX_LABEL_VALUE_MAPPING = {
  label1: 'value1',
  label2: 'value2',
};

// eslint-disable-next-line
function TestFormCheckboxGroup({ ...props }: FormCheckboxGroupProps<any>) {
  return (
    <Form>
      <FormCheckboxGroup {...props} />
    </Form>
  );
}

describe('FormCheckboxGroup', () => {
  it('should throw if not wrapped in Form', () => {
    const labelText = 'testLabel';
    const name = 'testName';

    expect(() =>
      render(
        <FormCheckboxGroup
          checkboxLabelValueMapping={MOCK_CHECKBOX_LABEL_VALUE_MAPPING}
          label={labelText}
          name={name}
        />,
      ),
    ).toThrow();
  });

  it('should render as a group element', () => {
    const labelText = 'testLabel';
    const name = 'testName';
    render(
      <TestFormCheckboxGroup
        checkboxLabelValueMapping={MOCK_CHECKBOX_LABEL_VALUE_MAPPING}
        label={labelText}
        name={name}
      />,
    );

    const groupElement = screen.getByRole('group', { name: labelText });

    expect(groupElement).toBeInTheDocument();
  });

  it('should render provided label text', () => {
    const labelText = 'testLabel';
    const name = 'testName';
    render(
      <TestFormCheckboxGroup
        checkboxLabelValueMapping={MOCK_CHECKBOX_LABEL_VALUE_MAPPING}
        label={labelText}
        name={name}
      />,
    );

    const label = screen.getByText(labelText);

    expect(label).toBeInTheDocument();
  });

  it('should render error message if showErrorMessage and errorMessage', () => {
    const errorMessage = 'testError';
    const labelText = 'testLabel';
    const name = 'testName';
    render(
      <TestFormCheckboxGroup
        checkboxLabelValueMapping={MOCK_CHECKBOX_LABEL_VALUE_MAPPING}
        errorMessage={errorMessage}
        label={labelText}
        name={name}
        showErrorMessage={true}
      />,
    );

    const error = screen.getByText(errorMessage);

    expect(error).toBeInTheDocument();
  });

  it('should describe the group by the error text when errorMessage is set', () => {
    const errorMessage = 'testError';
    const labelText = 'testLabel';
    const name = 'testName';
    render(
      <TestFormCheckboxGroup
        checkboxLabelValueMapping={MOCK_CHECKBOX_LABEL_VALUE_MAPPING}
        errorMessage={errorMessage}
        label={labelText}
        name={name}
      />,
    );

    const groupElement = screen.getByRole('group');
    const error = screen.getByText(errorMessage);

    expect(groupElement).toHaveAttribute('aria-describedby', error.id);
  });

  it('should not describe the group when there is no errorMessage', () => {
    const labelText = 'testLabel';
    const name = 'testName';
    render(
      <TestFormCheckboxGroup
        checkboxLabelValueMapping={MOCK_CHECKBOX_LABEL_VALUE_MAPPING}
        label={labelText}
        name={name}
      />,
    );

    const groupElement = screen.getByRole('group', { name: labelText });

    expect(groupElement).not.toHaveAttribute('aria-describedby');
  });

  it('should not describe the group when errorMessage is set but showErrorMessage is false', () => {
    const errorMessage = 'testError';
    const labelText = 'testLabel';
    const name = 'testName';
    render(
      <TestFormCheckboxGroup
        checkboxLabelValueMapping={MOCK_CHECKBOX_LABEL_VALUE_MAPPING}
        errorMessage={errorMessage}
        label={labelText}
        name={name}
        showErrorMessage={false}
      />,
    );

    const groupElement = screen.getByRole('group', { name: labelText });

    expect(groupElement).not.toHaveAttribute('aria-describedby');
  });

  it('should never mark the group invalid, regardless of errorMessage', () => {
    const labelText = 'testLabel';
    const name = 'testName';
    const { rerender } = render(
      <TestFormCheckboxGroup
        checkboxLabelValueMapping={MOCK_CHECKBOX_LABEL_VALUE_MAPPING}
        label={labelText}
        name={name}
      />,
    );

    expect(screen.getByRole('group')).not.toHaveAttribute('aria-invalid');

    rerender(
      <TestFormCheckboxGroup
        checkboxLabelValueMapping={MOCK_CHECKBOX_LABEL_VALUE_MAPPING}
        errorMessage="testError"
        label={labelText}
        name={name}
      />,
    );

    expect(screen.getByRole('group')).not.toHaveAttribute('aria-invalid');
  });

  it('should not reach the fieldset or any checkbox with the required attribute', () => {
    const labelText = 'testLabel';
    const name = 'testName';
    render(
      <TestFormCheckboxGroup
        checkboxLabelValueMapping={MOCK_CHECKBOX_LABEL_VALUE_MAPPING}
        label={labelText}
        name={name}
        required={true}
      />,
    );

    const groupElement = screen.getByRole('group');

    expect(groupElement).not.toHaveAttribute('required');
    for (const checkbox of screen.getAllByRole('checkbox')) {
      expect(checkbox).not.toBeRequired();
    }
  });
});
