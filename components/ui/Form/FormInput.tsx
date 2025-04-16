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

type FormInputProps<T extends FieldValues> = ComponentProps<'input'> & {
  register: UseFormRegister<T>;
  label: string;
  name: Path<T>;
  type: Exclude<HTMLInputTypeAttribute, 'password'>;
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
      <p>
        <span>{label}</span>
        {required && <span className="text-error-400 mx-1">*</span>}
      </p>
      <input
        className={twMerge(
          errorMessage ? inputVariants['error'] : inputVariants[variant],
          'mt-2',
          className,
        )}
        id={name}
        placeholder={placeholder}
        type={type}
        {...props}
        {...register(name, registerOptions)}
      />
      {showErrorMessage && (
        <p className="text-error-400 my-1 whitespace-pre-wrap">
          {errorMessage || ' '}
        </p>
      )}
    </label>
  );
}
