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

import { ToggleVisibilityButton } from '../ToggleVisibilityButton/ToggleVisibilityButton';

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
      <p>
        <span>{label}</span>
        {required && <span className="text-error-400 mx-1">*</span>}
      </p>
      <div className="relative">
        <input
          className={twMerge(
            errorMessage ? inputVariants['error'] : inputVariants[variant],
            className,
          )}
          id={name}
          placeholder={placeholder}
          type={passwordVisible ? 'text' : 'password'}
          {...props}
          {...register(name, registerOptions)}
        />
        <div className="absolute top-0 right-0 flex h-8 flex-col justify-center">
          <ToggleVisibilityButton
            isVisible={passwordVisible}
            onClick={handlePasswordVisibility}
          />
        </div>
      </div>
      {showErrorMessage && (
        <p className="text-error-400 my-1 whitespace-pre-wrap">
          {errorMessage || ' '}
        </p>
      )}
    </label>
  );
}
