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

import { useForm } from '../../form';
import { InputErrorText } from '../input/error-text/error-text';
import { InputLabelText } from '../input/label-text/label-text';

export type FormSelectProps<TFieldValues extends FieldValues> = {
  label: string;
  name: Path<TFieldValues>;
  options: Record<string, string>;
  register?: UseFormRegister<TFieldValues>;
  className?: string;
  variant?: InputVariants;
  registerOptions?: RegisterOptions<TFieldValues>;
  required?: boolean;
  errorMessage?: string | undefined;
  showErrorMessage?: boolean;
  hasEmptyOption?: boolean;
};

export function FormSelect<TFieldValues extends FieldValues>({
  register,
  label,
  name,
  registerOptions,
  options,
  errorMessage,
  className,
  variant = 'default',
  required = false,
  showErrorMessage = true,
  hasEmptyOption = true,
}: FormSelectProps<TFieldValues>) {
  useForm();

  const errorId = useId();

  return (
    <label className="text-sm">
      <InputLabelText required={required} text={label} />
      <select
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
        {...(register ? register(name, registerOptions) : {})}
      >
        {hasEmptyOption && (
          <option className="bg-light-500 dark:bg-dark-500" value="">
            None
          </option>
        )}
        {Object.keys(options).map((key) => (
          <option
            key={key}
            className="bg-light-500 dark:bg-dark-500"
            value={options[key]}
          >
            {key}
          </option>
        ))}
      </select>
      {showErrorMessage && (
        <InputErrorText errorMessage={errorMessage} id={errorId} />
      )}
    </label>
  );
}
