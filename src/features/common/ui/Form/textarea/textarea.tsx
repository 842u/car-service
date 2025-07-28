import { ComponentProps } from 'react';
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
import { ErrorText } from '../input/error-text';
import { LabelText } from '../input/label-text';

type TextareaProps<T extends FieldValues> = ComponentProps<'textarea'> & {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  registerOptions?: RegisterOptions<T>;
  variant?: InputVariants;
  required?: boolean;
  showErrorMessage?: boolean;
  errorMessage?: string;
};

export function Textarea<T extends FieldValues>({
  label,
  name,
  className,
  errorMessage,
  register,
  registerOptions,
  required = false,
  variant = 'default',
  showErrorMessage = true,
  ...props
}: TextareaProps<T>) {
  useForm();

  return (
    <label>
      <LabelText required={required} text={label} />
      <textarea
        className={twMerge(
          errorMessage ? inputVariants['error'] : inputVariants[variant],
          'my-1 h-auto min-h-10 py-2',
          className,
        )}
        rows={4}
        {...props}
        {...register(name, registerOptions)}
      />
      {showErrorMessage && <ErrorText errorMessage={errorMessage} />}
    </label>
  );
}
