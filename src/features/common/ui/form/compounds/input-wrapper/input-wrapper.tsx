import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import { useForm } from '../../form';

type FormInputWrapperProps = ComponentProps<'div'>;

export function FormInputWrapper({
  children,
  className,
}: FormInputWrapperProps) {
  useForm();

  return (
    <div
      className={twMerge(
        'flex w-full flex-col justify-start md:w-72',
        className,
      )}
    >
      {children}
    </div>
  );
}
