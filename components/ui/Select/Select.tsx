import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

type SelectProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  label: string;
  name: Path<T>;
  options: Record<string, string>;
  registerOptions?: RegisterOptions<T>;
  required?: boolean;
  errorMessage?: string | undefined;
  showErrorMessage?: boolean;
  hasEmptyOption?: boolean;
};

export function Select<T extends FieldValues>({
  register,
  label,
  name,
  registerOptions,
  options,
  errorMessage,
  required = false,
  showErrorMessage = true,
  hasEmptyOption = true,
}: SelectProps<T>) {
  return (
    <label className="text-sm" htmlFor={name}>
      <p>
        <span>{label}</span>
        {required && <span className="text-error-300 mx-1">*</span>}
      </p>
      <select
        className={twMerge(
          'border-alpha-grey-300 bg-light-600 placeholder:text-light-900 focus:border-alpha-grey-500 focus:ring-alpha-grey-700 dark:bg-dark-700 mt-2 block h-10 w-full rounded-md border px-4 py-2 placeholder:text-sm',
          errorMessage
            ? 'border-error-500 bg-error-200 focus:border-error-500 dark:bg-error-900'
            : '',
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
