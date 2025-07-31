import type { ChangeEvent } from 'react';
import { useEffect, useRef } from 'react';
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
  onChange,
}: UseFormImageInputOptions<T>) {
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
