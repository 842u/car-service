'use client';

import type { ComponentProps } from 'react';
import { useId } from 'react';
import { twMerge } from 'tailwind-merge';

import type { SectionVariants } from '@/ui/variants/section';
import { sectionVariants } from '@/ui/variants/section';

import { SectionControls } from './compounds/controls/controls';
import { SectionHeading } from './compounds/heading/heading';
import { SectionSubtext } from './compounds/subtext/subtext';
import { SectionText } from './compounds/text/text';
import { DashboardSectionContext } from './use-dashboard-section';

type DashboardSectionProps = ComponentProps<'section'> & {
  variant?: SectionVariants;
};

export function DashboardSection({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  className,
  variant = 'default',
  ...props
}: DashboardSectionProps) {
  const headingId = useId();

  return (
    <DashboardSectionContext value={{ headingId }}>
      <section
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : (ariaLabelledBy ?? headingId)}
        className={twMerge(sectionVariants[variant], className)}
        {...props}
      >
        {children}
      </section>
    </DashboardSectionContext>
  );
}

DashboardSection.Heading = SectionHeading;
DashboardSection.Text = SectionText;
DashboardSection.Subtext = SectionSubtext;
DashboardSection.Controls = SectionControls;
