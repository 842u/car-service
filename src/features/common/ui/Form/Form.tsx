import { ComponentProps, createContext } from 'react';
import { twMerge } from 'tailwind-merge';

import { useContextGuard } from '@/features/common/hooks/use-context-guard';
import { FormVariants } from '@/types';
import { formVariants } from '@/utils/tailwindcss/form';

import { FormButtonSubmit } from './button-submit/button-submit';
import { FormCheckboxGroup } from './checkbox-group/checkbox-group';
import { FormControls } from './controls/controls';
import { FormInput } from './input/input';
import { FormInputImage } from './input-image/input-image';
import { FormInputPassword } from './input-password/input-password';
import { FormInputWrapper } from './input-wrapper/input-wrapper';
import { FormSelect } from './select/select';
import { FormTextarea } from './textarea/textarea';

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
Form.InputPassword = FormInputPassword;
Form.InputImage = FormInputImage;
Form.InputWrapper = FormInputWrapper;
Form.ButtonSubmit = FormButtonSubmit;
Form.Controls = FormControls;
Form.Select = FormSelect;
Form.CheckboxGroup = FormCheckboxGroup;
Form.Textarea = FormTextarea;
