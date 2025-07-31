import { ComponentProps, createContext } from 'react';
import { twMerge } from 'tailwind-merge';

import { useContextGuard } from '@/common/hooks/use-context-guard';
import { FormVariants } from '@/types';
import { formVariants } from '@/utils/tailwindcss/form';

import { ButtonSubmit } from './compounds/button-submit/button-submit';
import { CheckboxGroup } from './compounds/checkbox-group/checkbox-group';
import { Controls } from './compounds/controls/controls';
import { Input } from './compounds/input/input';
import { InputImage } from './compounds/input-image/input-image';
import { InputPassword } from './compounds/input-password/input-password';
import { InputWrapper } from './compounds/input-wrapper/input-wrapper';
import { Select } from './compounds/select/select';
import { Textarea } from './compounds/textarea/textarea';

export type FormProps = ComponentProps<'form'> & {
  variant?: FormVariants;
};

type FormContextValue = true;

const FormContext = createContext<FormContextValue | null>(null);

export function useForm() {
  return useContextGuard({
    context: FormContext,
    componentName: 'Form',
  });
}

export function Form({
  children,
  className,
  variant = 'default',
  ...props
}: FormProps) {
  return (
    <FormContext value={true}>
      <form className={twMerge(formVariants[variant], className)} {...props}>
        {children}
      </form>
    </FormContext>
  );
}

Form.Input = Input;
Form.InputPassword = InputPassword;
Form.InputImage = InputImage;
Form.InputWrapper = InputWrapper;
Form.ButtonSubmit = ButtonSubmit;
Form.Controls = Controls;
Form.Select = Select;
Form.CheckboxGroup = CheckboxGroup;
Form.Textarea = Textarea;
