import type { ComponentProps } from 'react';
import { createContext } from 'react';
import { twMerge } from 'tailwind-merge';

import { useContextGuard } from '@/common/hooks/use-context-guard';
import type { FormVariants } from '@/types';
import { formVariants } from '@/utils/tailwindcss/form';

import { FormCheckboxGroup } from './compounds/checkbox-group/checkbox-group';
import { FormControls } from './compounds/controls/controls';
import { FormInput } from './compounds/input/input';
import { FormImageInput } from './compounds/input-image/image-input';
import { FormInputWrapper } from './compounds/input-wrapper/input-wrapper';
import { FormPasswordInput } from './compounds/password-input/password-input';
import { FormSelect } from './compounds/select/select';
import { FormSubmitButton } from './compounds/submit-button/submit-button';
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

Form.Input = FormInput;
Form.InputPassword = FormPasswordInput;
Form.InputImage = FormImageInput;
Form.InputWrapper = FormInputWrapper;
Form.ButtonSubmit = FormSubmitButton;
Form.Controls = FormControls;
Form.Select = FormSelect;
Form.CheckboxGroup = FormCheckboxGroup;
Form.Textarea = Textarea;
