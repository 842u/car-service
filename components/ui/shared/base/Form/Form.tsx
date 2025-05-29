import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import { FormVariants } from '@/types';
import { formVariants } from '@/utils/tailwindcss/form';

import { FormButtonSubmit } from './FormButtonSubmit/FormButtonSubmit';
import { FormCheckboxGroup } from './FormCheckboxGroup/FormCheckboxGroup';
import { FormControls } from './FormControls/FormControls';
import { FormInput } from './FormInput/FormInput';
import { FormInputWrapper } from './FormInput/FormInputWrapper';
import { FormInputImage } from './FormInputImage/FormInputImage';
import { FormInputPassword } from './FormInputPassword/FormInputPassword';
import { FormSelect } from './FormSelect/FormSelect';

export type FormProps = ComponentProps<'form'> & {
  variant?: FormVariants;
};

export function Form({
  children,
  className,
  variant = 'default',
  ...props
}: FormProps) {
  return (
    <form className={twMerge(formVariants[variant], className)} {...props}>
      {children}
    </form>
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
