import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import { useForm } from '../../form';

type InputWrapperProps = ComponentProps<'div'>;

export function InputWrapper({ children, className }: InputWrapperProps) {
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
