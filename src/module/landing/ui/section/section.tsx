'use client';

import type { ComponentProps } from 'react';
import { useId } from 'react';
import { twMerge } from 'tailwind-merge';

import { LandingSectionHeading } from './compounds/heading/heading';
import { LandingSectionContext } from './use-landing-section';

type LandingSectionProps = ComponentProps<'section'>;

export function LandingSection({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  className,
  children,
  ...props
}: LandingSectionProps) {
  const headingId = useId();

  return (
    <LandingSectionContext value={{ headingId }}>
      <section
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : (ariaLabelledBy ?? headingId)}
        className={twMerge(
          'm-auto my-10 w-11/12 max-w-7xl md:w-10/12 lg:my-20',
          className,
        )}
        {...props}
      >
        {children}
      </section>
    </LandingSectionContext>
  );
}

LandingSection.Heading = LandingSectionHeading;
