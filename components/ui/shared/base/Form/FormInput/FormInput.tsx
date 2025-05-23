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

import { FormInputErrorText } from './FormInputErrorText';
import { FormInputLabelText } from './FormInputLabelText';

type FormInputProps<T extends FieldValues> = ComponentProps<'input'> & {
  label: string;
  name: Path<T>;
  type: Exclude<HTMLInputTypeAttribute, 'password'>;
  register?: UseFormRegister<T>;
  variant?: InputVariants;
  required?: boolean;
  registerOptions?: RegisterOptions<T>;
  placeholder?: string;
  errorMessage?: string | undefined;
  showErrorMessage?: boolean;
};

export function FormInput<T extends FieldValues>({
  register,
  label,
  name,
  type,
  placeholder,
  registerOptions,
  errorMessage,
  className,
  variant = 'default',
  showErrorMessage = true,
  required = false,
  ...props
}: FormInputProps<T>) {
  return (
    <label htmlFor={name}>
      <FormInputLabelText required={required} text={label} />
      <input
        className={twMerge(
          errorMessage ? inputVariants['error'] : inputVariants[variant],
          'my-1',
          className,
        )}
        id={name}
        placeholder={placeholder}
        type={type}
        {...props}
        {...(register ? register(name, registerOptions) : {})}
      />
      {showErrorMessage && <FormInputErrorText errorMessage={errorMessage} />}
    </label>
  );
}
