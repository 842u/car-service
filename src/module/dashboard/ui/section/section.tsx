import type { ComponentProps } from 'react';
import { createContext, useId } from 'react';
import { twMerge } from 'tailwind-merge';

import { useContextGuard } from '@/common/presentation/hook/use-context-guard';
import type { SectionVariants } from '@/ui/variants/section';
import { sectionVariants } from '@/ui/variants/section';

import { SectionControls } from './compounds/controls/controls';
import { SectionHeading } from './compounds/heading/heading';
import { SectionSubtext } from './compounds/subtext/subtext';
import { SectionText } from './compounds/text/text';

type DashboardSectionContextValue = { headingId: string } | null;

const DashboardSectionContext =
  createContext<DashboardSectionContextValue>(null);

export function useDashboardSection() {
  return useContextGuard({
    context: DashboardSectionContext,
    componentName: 'DashboardSection',
  });
}

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
