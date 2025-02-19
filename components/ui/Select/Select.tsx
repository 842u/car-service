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
  registerOptions: RegisterOptions<T>;
  errorMessage?: string | undefined;
  showErrorMessage?: boolean;
  options: Record<string, string | undefined>;
};

export function Select<T extends FieldValues>({
  register,
  label,
  name,
  registerOptions,
  errorMessage,
  showErrorMessage,
  options,
}: SelectProps<T>) {
  return (
    <label className="text-sm" htmlFor={name}>
      {label}
      <select
        className={twMerge(
          'border-alpha-grey-300 bg-light-600 dark:border-alpha-grey-300 dark:bg-dark-700 block w-full rounded-md border px-4 py-2',
          errorMessage
            ? 'border-error-500 bg-error-200 focus:border-error-500 dark:bg-error-900'
            : '',
        )}
        id={name}
        {...register(name, registerOptions)}
      >
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
