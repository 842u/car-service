'use client';

import { ComponentProps, useState } from 'react';
import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import { InputVariants } from '@/types';
import { inputVariants } from '@/utils/tailwindcss/input';

import { ToggleVisibilityButton } from '../../buttons/ToggleVisibilityButton/ToggleVisibilityButton';
import { FormInputErrorText } from './FormInputErrorText';
import { FormInputLabelText } from './FormInputLabelText';

type FormInputPasswordProps<T extends FieldValues> = Omit<
  ComponentProps<'input'>,
  'type'
> & {
  register: UseFormRegister<T>;
  label: string;
  name: Path<T>;
  variant?: InputVariants;
  required?: boolean;
  registerOptions?: RegisterOptions<T>;
  placeholder?: string;
  errorMessage?: string | undefined;
  showErrorMessage?: boolean;
};

export function FormInputPassword<T extends FieldValues>({
  register,
  label,
  name,
  placeholder,
  registerOptions,
  errorMessage,
  className,
  variant = 'default',
  showErrorMessage = true,
  required = false,
  ...props
}: FormInputPasswordProps<T>) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handlePasswordVisibility = () => {
    setPasswordVisible((currentState) => !currentState);
  };

  return (
    <label htmlFor={name}>
      <FormInputLabelText required={required} text={label} />
      <div
        className={twMerge(
          errorMessage ? inputVariants['error'] : inputVariants[variant],
          'my-1 flex items-center p-0',
          className,
        )}
      >
        <input
          className="inline-block h-full w-full pl-3"
          id={name}
          placeholder={placeholder}
          type={passwordVisible ? 'text' : 'password'}
          {...props}
          {...register(name, registerOptions)}
        />
        <div className="inline-block h-full p-1">
          <ToggleVisibilityButton
            className="h-full w-full px-1 py-0"
            isVisible={passwordVisible}
            onClick={handlePasswordVisibility}
          />
        </div>
      </div>
      {showErrorMessage && <FormInputErrorText errorMessage={errorMessage} />}
    </label>
  );
}
