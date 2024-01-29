import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';

import { passwordValidationRules } from '@/utils/validation';

import { Input } from './Input';

describe('Input', () => {
  it('should render input', () => {
    const placeholderText = 'Enter your inputs ...';
    const identifier = 'test-input';

    function MockForm() {
      const { register } = useForm();

      return (
        <Input
          label={identifier}
          name={identifier}
          placeholder={placeholderText}
          register={register}
          registerOptions={passwordValidationRules}
          type="text"
        />
      );
    }

    render(<MockForm />);

    const input = screen.getByPlaceholderText(placeholderText);

    expect(input).toBeInTheDocument();
  });

  it('should render label with proper text', () => {
    const placeholderText = 'Enter your inputs ...';
    const identifier = 'test-input';

    function MockForm() {
      const { register } = useForm();

      return (
        <Input
          label={identifier}
          name={identifier}
          placeholder={placeholderText}
          register={register}
          registerOptions={passwordValidationRules}
          type="text"
        />
      );
    }

    render(<MockForm />);

    const input = screen.getByText(identifier);

    expect(input).toBeInTheDocument();
  });

  it('should render error message if provided', () => {
    const placeholderText = 'Enter your inputs ...';
    const identifier = 'test-input';
    const errorMessage = 'Something went wrong';

    function MockForm() {
      const { register } = useForm();

      return (
        <Input
          errorMessage={errorMessage}
          label={identifier}
          name={identifier}
          placeholder={placeholderText}
          register={register}
          registerOptions={passwordValidationRules}
          type="text"
        />
      );
    }

    render(<MockForm />);

    const input = screen.getByText(errorMessage);

    expect(input).toBeInTheDocument();
  });

  it('should render password visibility button if input type=password', () => {
    const placeholderText = 'Enter your inputs ...';
    const identifier = 'test-input';

    function MockForm() {
      const { register } = useForm();

      return (
        <Input
          label={identifier}
          name={identifier}
          placeholder={placeholderText}
          register={register}
          registerOptions={passwordValidationRules}
          type="password"
        />
      );
    }

    render(<MockForm />);

    const visibilityButton = screen.getByRole('button', {
      name: 'toggle visibility',
    });

    expect(visibilityButton).toBeInTheDocument();
  });

  it('should switch input type from pasword to text if visibility button is clicked', async () => {
    const user = userEvent.setup();
    const placeholderText = 'Enter your inputs ...';
    const identifier = 'test-input';

    function MockForm() {
      const { register } = useForm();

      return (
        <Input
          label={identifier}
          name={identifier}
          placeholder={placeholderText}
          register={register}
          registerOptions={passwordValidationRules}
          type="password"
        />
      );
    }

    render(<MockForm />);

    const input = screen.getByPlaceholderText(placeholderText);

    const visibilityButton = screen.getByRole('button', {
      name: 'toggle visibility',
    });

    expect(input).toHaveAttribute('type', 'password');
    await user.click(visibilityButton);
    expect(input).toHaveAttribute('type', 'text');
    await user.click(visibilityButton);
    expect(input).toHaveAttribute('type', 'password');
  });
});
