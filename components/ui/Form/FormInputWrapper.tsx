import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

type FormInputWrapperProps = ComponentProps<'div'>;

export function FormInputWrapper({
  children,
  className,
}: FormInputWrapperProps) {
  return (
    <div className={twMerge('flex w-full flex-col md:w-72', className)}>
      {children}
    </div>
  );
}
