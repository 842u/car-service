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

import { useForm } from '../../form';
import { InputErrorText } from './error-text/error-text';
import { InputLabelText } from './label-text/label-text';

export type FormInputProps<T extends FieldValues> = ComponentProps<'input'> & {
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

export function FormInput<T extends FieldValues>({
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
}: FormInputProps<T>) {
  useForm();

  return (
    <label>
      <InputLabelText required={required} text={label} />
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
      {showErrorMessage && <InputErrorText errorMessage={errorMessage} />}
    </label>
  );
}
