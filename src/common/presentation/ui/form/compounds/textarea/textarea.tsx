import type { ComponentProps } from 'react';
import { useId } from 'react';
import type {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import type { InputVariants } from '@/ui/variants/input';
import { inputVariants } from '@/ui/variants/input';

import { useForm } from '../../use-form';
import { InputErrorText } from '../input/error-text/error-text';
import { InputLabelText } from '../input/label-text/label-text';

export type TextareaProps<TFieldValues extends FieldValues> =
  ComponentProps<'textarea'> & {
    label: string;
    name: Path<TFieldValues>;
    register?: UseFormRegister<TFieldValues>;
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

  const errorId = useId();

  return (
    <label>
      <InputLabelText required={required} text={label} />
      <textarea
        aria-describedby={
          errorMessage && showErrorMessage ? errorId : undefined
        }
        aria-invalid={Boolean(errorMessage) || undefined}
        className={twMerge(
          errorMessage ? inputVariants['error'] : inputVariants[variant],
          'my-1 h-auto min-h-10 py-2',
          className,
        )}
        required={required}
        rows={4}
        {...props}
        {...(register ? register(name, registerOptions) : {})}
      />
      {showErrorMessage && (
        <InputErrorText errorMessage={errorMessage} id={errorId} />
      )}
    </label>
  );
}
