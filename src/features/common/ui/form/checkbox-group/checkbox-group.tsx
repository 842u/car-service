import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';

import { useForm } from '../form';
import { ErrorText } from '../input/error-text';
import { LabelText } from '../input/label-text';

type CheckboxGroupProps<T extends FieldValues> = {
  label: string;
  checkboxLabelValueMapping: Record<string, string>;
  register: UseFormRegister<T>;
  name: Path<T>;
  required?: boolean;
  registerOptions?: RegisterOptions<T>;
  errorMessage?: string;
  showErrorMessage?: boolean;
};

export function CheckboxGroup<T extends FieldValues>({
  checkboxLabelValueMapping,
  label,
  register,
  name,
  registerOptions,
  errorMessage,
  required = false,
  showErrorMessage = true,
}: CheckboxGroupProps<T>) {
  useForm();

  return (
    <fieldset>
      <legend>
        <LabelText required={required} text={label} />
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
      {showErrorMessage && <ErrorText errorMessage={errorMessage} />}
    </fieldset>
  );
}
