import type { ComponentProps, HTMLInputTypeAttribute } from 'react';
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
import { InputErrorText } from './error-text/error-text';
import { InputLabelText } from './label-text/label-text';

export type FormInputProps<TFieldValues extends FieldValues> =
  ComponentProps<'input'> & {
    label: string;
    name: Path<TFieldValues>;
    type: Exclude<HTMLInputTypeAttribute, 'password'>;
    register?: UseFormRegister<TFieldValues>;
    variant?: InputVariants;
    required?: boolean;
    registerOptions?: RegisterOptions<TFieldValues>;
    errorMessage?: string | undefined;
    showErrorMessage?: boolean;
  };

export function FormInput<TFieldValues extends FieldValues>({
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
}: FormInputProps<TFieldValues>) {
  useForm();

  const errorId = useId();

  return (
    <label>
      <InputLabelText required={required} text={label} />
      <input
        aria-describedby={
          errorMessage && showErrorMessage ? errorId : undefined
        }
        aria-invalid={Boolean(errorMessage) || undefined}
        className={twMerge(
          errorMessage ? inputVariants['error'] : inputVariants[variant],
          'my-1',
          className,
        )}
        required={required}
        type={type}
        {...props}
        {...(register ? register(name, registerOptions) : {})}
      />
      {showErrorMessage && (
        <InputErrorText errorMessage={errorMessage} id={errorId} />
      )}
    </label>
  );
}
