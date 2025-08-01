'use client';

import type { ComponentProps } from 'react';
import { useState } from 'react';
import type {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import type { InputVariants } from '@/types';
import { VisibilityButton } from '@/ui/visibility-button/visibility-button';
import { inputVariants } from '@/utils/tailwindcss/input';

import { useForm } from '../../form';
import { InputErrorText } from '../input/error-text/error-text';
import { InputLabelText } from '../input/label-text/label-text';

export type FormPasswordInputProps<T extends FieldValues> = Omit<
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

export function FormPasswordInput<T extends FieldValues>({
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
}: FormPasswordInputProps<T>) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  useForm();

  const handleVisibilityButtonClick = () => {
    setPasswordVisible((currentState) => !currentState);
  };

  return (
    <label>
      <InputLabelText required={required} text={label} />
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
            onClick={handleVisibilityButtonClick}
          />
        </div>
      </div>
      {showErrorMessage && <InputErrorText errorMessage={errorMessage} />}
    </label>
  );
}
