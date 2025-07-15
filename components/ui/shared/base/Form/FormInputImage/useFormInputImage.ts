import { ChangeEvent, useEffect, useRef } from 'react';
import { FieldValues, useController } from 'react-hook-form';

import { useForm } from '../Form';
import { FormInputImageProps } from './FormInputImage';

type UseFormInputImageOptions<T extends FieldValues> = Pick<
  FormInputImageProps<T>,
  'control' | 'defaultValue' | 'name' | 'rules' | 'onChange'
>;

export function useFormInputImage<T extends FieldValues>({
  control,
  defaultValue,
  name,
  rules,
  onChange,
}: UseFormInputImageOptions<T>) {
  const inputElementRef = useRef<HTMLInputElement>(null);

  const { field } = useController({ name, control, rules, defaultValue });

  useForm();

  useEffect(() => {
    if (!field.value) {
      onChange && onChange(null);
      field.onChange(null);
    }
  }, [field, onChange]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    onChange && onChange(file);
    field.onChange(file);
  };

  return { handleFileChange, inputElementRef };
}
