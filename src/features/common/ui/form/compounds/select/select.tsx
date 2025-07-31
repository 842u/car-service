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

export type FormSelectProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  options: Record<string, string>;
  register?: UseFormRegister<T>;
  className?: string;
  variant?: InputVariants;
  registerOptions?: RegisterOptions<T>;
  required?: boolean;
  errorMessage?: string | undefined;
  showErrorMessage?: boolean;
  hasEmptyOption?: boolean;
};

export function FormSelect<T extends FieldValues>({
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
}: FormSelectProps<T>) {
  useForm();

  return (
    <label className="text-sm">
      <InputLabelText required={required} text={label} />
      <select
        className={twMerge(
          errorMessage ? inputVariants['error'] : inputVariants[variant],
          'my-1',
          className,
        )}
        {...(register ? register(name, registerOptions) : {})}
      >
        {hasEmptyOption && (
          <option className="bg-light-500 dark:bg-dark-500" value={undefined} />
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
      {showErrorMessage && <InputErrorText errorMessage={errorMessage} />}
    </label>
  );
}
