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
import { VisibilityButton } from '@/ui/visibility-button/visibility-button';
import { inputVariants } from '@/utils/tailwindcss/input';

import { useForm } from '../form-tempname';
import { ErrorText } from '../input/error-text';
import { LabelText } from '../input/label-text';

export type InputPasswordProps<T extends FieldValues> = Omit<
  ComponentProps<'input'>,
  'type'
> & {
  label: string;
  name: Path<T>;
  register?: UseFormRegister<T>;
  variant?: InputVariants;
  required?: boolean;
  registerOptions?: RegisterOptions<T>;
  errorMessage?: string | undefined;
  showErrorMessage?: boolean;
};

export function InputPassword<T extends FieldValues>({
  register,
  label,
  name,
  registerOptions,
  errorMessage,
  className,
  variant = 'default',
  showErrorMessage = true,
  required = false,
  ...props
}: InputPasswordProps<T>) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  useForm();

  const handlePasswordVisibility = () => {
    setPasswordVisible((currentState) => !currentState);
  };

  return (
    <label>
      <LabelText required={required} text={label} />
      <div
        className={twMerge(
          errorMessage ? inputVariants['error'] : inputVariants[variant],
          'my-1 flex items-center p-0',
          className,
        )}
      >
        <input
          className="inline-block h-full w-full pl-3"
          type={passwordVisible ? 'text' : 'password'}
          {...props}
          {...(register ? register(name, registerOptions) : {})}
        />
        <div className="inline-block h-full p-1">
          <VisibilityButton
            className="h-full w-full px-1 py-0"
            isVisible={passwordVisible}
            onClick={handlePasswordVisibility}
          />
        </div>
      </div>
      {showErrorMessage && <ErrorText errorMessage={errorMessage} />}
    </label>
  );
}
