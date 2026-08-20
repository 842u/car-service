import { useId } from 'react';
import type {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';

import { useForm } from '../../use-form';
import { InputErrorText } from '../input/error-text/error-text';
import { InputLabelText } from '../input/label-text/label-text';

export type FormCheckboxGroupProps<TFieldValues extends FieldValues> = {
  label: string;
  checkboxLabelValueMapping: Record<string, string>;
  register?: UseFormRegister<TFieldValues>;
  name: Path<TFieldValues>;
  required?: boolean;
  registerOptions?: RegisterOptions<TFieldValues>;
  errorMessage?: string;
  showErrorMessage?: boolean;
};

export function FormCheckboxGroup<TFieldValues extends FieldValues>({
  checkboxLabelValueMapping,
  label,
  register,
  name,
  registerOptions,
  errorMessage,
  required = false,
  showErrorMessage = true,
}: FormCheckboxGroupProps<TFieldValues>) {
  useForm();

  const errorId = useId();

  return (
    <fieldset
      aria-describedby={errorMessage && showErrorMessage ? errorId : undefined}
    >
      <legend>
        <InputLabelText required={required} text={label} />
      </legend>
      {Object.keys(checkboxLabelValueMapping).map((checkboxLabel) => (
        <label
          key={checkboxLabel}
          className="accent-accent-500 block text-base"
        >
          <input
            className="mr-2"
            type="checkbox"
            value={checkboxLabelValueMapping[checkboxLabel]}
            {...(register ? register(name, registerOptions) : {})}
          />
          {checkboxLabel}
        </label>
      ))}
      {showErrorMessage && (
        <InputErrorText errorMessage={errorMessage} id={errorId} />
      )}
    </fieldset>
  );
}
