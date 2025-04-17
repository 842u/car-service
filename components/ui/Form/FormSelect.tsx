import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import { InputVariants } from '@/types';
import { inputVariants } from '@/utils/tailwindcss/input';

import { FormInputLabelText } from './FormInput/FormInputLabelText';

type FormSelectProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  label: string;
  name: Path<T>;
  options: Record<string, string>;
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
  variant = 'default',
  required = false,
  showErrorMessage = true,
  hasEmptyOption = true,
}: FormSelectProps<T>) {
  return (
    <label className="text-sm" htmlFor={name}>
      <FormInputLabelText required={required} text={label} />
      <select
        className={twMerge(
          errorMessage ? inputVariants['error'] : inputVariants[variant],
          'text-dark-500 dark:text-light-500',
        )}
        id={name}
        {...register(name, registerOptions)}
      >
        {hasEmptyOption && <option value={undefined} />}
        {Object.keys(options).map((key) => (
          <option key={key} value={options[key]}>
            {key}
          </option>
        ))}
      </select>
      {showErrorMessage && (
        <p className="text-error-400 my-1 text-sm whitespace-pre-wrap">
          {errorMessage || ' '}
        </p>
      )}
    </label>
  );
}
