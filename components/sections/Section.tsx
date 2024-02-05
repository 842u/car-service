import { ComponentProps, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type SectionProps = ComponentProps<'section'> & {
  className?: string;
  children?: ReactNode;
};

export function Section({ className, children, ...props }: SectionProps) {
  return (
    <section
      className={twMerge(
        'm-auto my-10 w-11/12 max-w-7xl md:w-10/12 lg:my-20',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}
