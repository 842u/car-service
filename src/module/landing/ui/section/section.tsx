import type { ComponentProps } from 'react';
import { createContext, useId } from 'react';
import { twMerge } from 'tailwind-merge';

import { useContextGuard } from '@/common/presentation/hook/use-context-guard';

import { LandingSectionHeading } from './compounds/heading/heading';

type LandingSectionContextValue = { headingId: string } | null;

const LandingSectionContext = createContext<LandingSectionContextValue>(null);

export function useLandingSection() {
  return useContextGuard({
    context: LandingSectionContext,
    componentName: 'LandingSection',
  });
}

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
