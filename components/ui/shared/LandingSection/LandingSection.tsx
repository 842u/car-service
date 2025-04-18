import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

type LandingSectionProps = ComponentProps<'section'>;

export function LandingSection({
  className,
  children,
  ...props
}: LandingSectionProps) {
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
