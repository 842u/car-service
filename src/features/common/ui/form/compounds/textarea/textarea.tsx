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

import { useForm } from '../../form';
import { InputErrorText } from '../input/error-text/error-text';
import { InputLabelText } from '../input/label-text/label-text';

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
      <InputLabelText required={required} text={label} />
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
      {showErrorMessage && <InputErrorText errorMessage={errorMessage} />}
    </label>
  );
}
