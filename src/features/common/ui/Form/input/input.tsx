import { ComponentProps, HTMLInputTypeAttribute } from 'react';
import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import { InputVariants } from '@/types';
import { inputVariants } from '@/utils/tailwindcss/input';

import { useForm } from '../form';
import { ErrorText } from './error-text';
import { LabelText } from './label-text';

export type InputProps<T extends FieldValues> = ComponentProps<'input'> & {
  label: string;
  name: Path<T>;
  type: Exclude<HTMLInputTypeAttribute, 'password'>;
  register?: UseFormRegister<T>;
  variant?: InputVariants;
  required?: boolean;
  registerOptions?: RegisterOptions<T>;
  errorMessage?: string | undefined;
  showErrorMessage?: boolean;
};

export function Input<T extends FieldValues>({
  register,
  label,
  name,
  type,
  registerOptions,
  errorMessage,
  className,
  variant = 'default',
  showErrorMessage = true,
  required = false,
  ...props
}: InputProps<T>) {
  useForm();

  return (
    <label>
      <LabelText required={required} text={label} />
      <input
        className={twMerge(
          errorMessage ? inputVariants['error'] : inputVariants[variant],
          'my-1',
          className,
        )}
        type={type}
        {...props}
        {...(register ? register(name, registerOptions) : {})}
      />
      {showErrorMessage && <ErrorText errorMessage={errorMessage} />}
    </label>
  );
}
