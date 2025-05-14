import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FormInputPassword } from './FormInputPassword';

describe('FormInputPassword', () => {
  it('should render as a input of type="password"', () => {
    const labelText = 'testLabel';
    const name = 'testName';
    render(<FormInputPassword label={labelText} name={name} />);

    const inputElement = screen.getByLabelText(labelText);

    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'password');
  });

  it('should render a button for toggling password visibility', () => {
    const labelText = 'testLabel';
    const name = 'testName';
    render(<FormInputPassword label={labelText} name={name} />);

    const visibilityButton = screen.getByRole('button', {
      name: 'toggle visibility',
    });

    expect(visibilityButton).toBeInTheDocument();
  });

  it('should toggle input type between "text" & "password" on toggle visibility button click', async () => {
    const user = userEvent.setup();
    const labelText = 'testLabel';
    const name = 'testName';
    render(<FormInputPassword label={labelText} name={name} />);

    const inputElement = screen.getByLabelText(labelText);
    const visibilityButton = screen.getByRole('button', {
      name: 'toggle visibility',
    });

    expect(inputElement).toHaveAttribute('type', 'password');

    await user.click(visibilityButton);

    expect(inputElement).toHaveAttribute('type', 'text');

    await user.click(visibilityButton);

    expect(inputElement).toHaveAttribute('type', 'password');
  });

  it('should render error message if showErrorMessage & errorMessage', () => {
    const errorMessage = 'testError';
    const labelText = 'testLabel';
    const name = 'testName';
    render(
      <FormInputPassword
        errorMessage={errorMessage}
        label={labelText}
        name={name}
        showErrorMessage={true}
      />,
    );

    const error = screen.getByText(errorMessage);

    expect(error).toBeInTheDocument();
  });
});
