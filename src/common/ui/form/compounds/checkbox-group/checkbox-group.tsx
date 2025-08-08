import type {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';

import { useForm } from '../../form';
import { InputErrorText } from '../input/error-text/error-text';
import { InputLabelText } from '../input/label-text/label-text';

type FormCheckboxGroupProps<T extends FieldValues> = {
  label: string;
  checkboxLabelValueMapping: Record<string, string>;
  register: UseFormRegister<T>;
  name: Path<T>;
  required?: boolean;
  registerOptions?: RegisterOptions<T>;
  errorMessage?: string;
  showErrorMessage?: boolean;
};

export function FormCheckboxGroup<T extends FieldValues>({
  checkboxLabelValueMapping,
  label,
  register,
  name,
  registerOptions,
  errorMessage,
  required = false,
  showErrorMessage = true,
}: FormCheckboxGroupProps<T>) {
  useForm();

  return (
    <fieldset>
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
            {...register(name, registerOptions)}
          />
          {checkboxLabel}
        </label>
      ))}
      {showErrorMessage && <InputErrorText errorMessage={errorMessage} />}
    </fieldset>
  );
}
