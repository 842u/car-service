import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import { FormVariants } from '@/types';
import { formVariants } from '@/utils/tailwindcss/form';

import { FormInput } from './FormInput';
import { FormInputPassword } from './FormInputPassword';

type FormProps = ComponentProps<'form'> & {
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
