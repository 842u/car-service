import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';

import { useForm } from '../../form';
import type { FormImageInputProps } from './image-input';

type UseFormImageInputOptions<T extends FieldValues> = Pick<
  FormImageInputProps<T>,
  'control' | 'defaultValue' | 'name' | 'rules' | 'onChange'
>;

export function useFormImageInput<T extends FieldValues>({
  control,
  defaultValue,
  name,
  rules,
}: UseFormImageInputOptions<T>) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { field } = useController({ name, control, rules, defaultValue });

  useForm();

  useEffect(() => {
    if (!field.value) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(field.value);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [field.value]);

  /**
   * Handles file selection from the input element.
   *
   * @param event - The change event triggered when the user selects a file.
   *
   * @remarks
   * The input value is cleared after handling the file to ensure that selecting
   * the same file again will still trigger the `onChange` event.
   *
   * By default, browsers do not fire `onChange` if the selected file has not
   * changed. Resetting the value forces the input to treat the next selection
   * as a new change.
   *
   * `<input type="file" />` has a few quirks:
   *  - If the user opens the file dialog and clicks "Cancel", the input value
   *    is cleared automatically by the browser.
   * - However, when resetting a form via React Hook Form (`reset()`), the
   *   native file input value is NOT cleared, because RHF manages form state
   *   only and does not control the underlying DOM value of file inputs.
   *
   * Because of this inconsistency, we clear the value manually to keep behavior
   * predictable and ensure `onChange` fires reliably.
   */
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    field.onChange(file);
    event.target.value = '';
  };

  return { handleFileChange, previewUrl };
}
