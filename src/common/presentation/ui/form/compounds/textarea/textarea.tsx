import type { ComponentProps } from 'react';
import type {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import type { InputVariants } from '@/ui/variants/input';
import { inputVariants } from '@/ui/variants/input';

import { useForm } from '../../form';
import { InputErrorText } from '../input/error-text/error-text';
import { InputLabelText } from '../input/label-text/label-text';

type TextareaProps<TFieldValues extends FieldValues> =
  ComponentProps<'textarea'> & {
    label: string;
    name: Path<TFieldValues>;
    register: UseFormRegister<TFieldValues>;
    registerOptions?: RegisterOptions<TFieldValues>;
    variant?: InputVariants;
    required?: boolean;
    showErrorMessage?: boolean;
    errorMessage?: string;
  };

export function Textarea<TFieldValues extends FieldValues>({
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
}: TextareaProps<TFieldValues>) {
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
