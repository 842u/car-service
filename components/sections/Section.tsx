import { ComponentProps, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type SectionProps = ComponentProps<'section'> & {
  className?: string;
  children?: ReactNode;
};

export function Section({ className, children, ...props }: SectionProps) {
  return (
    <section
      className={twMerge('m-auto w-11/12 max-w-7xl', className)}
      {...props}
    >
      {children}
    </section>
  );
}
