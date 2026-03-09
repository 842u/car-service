import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import type { SectionVariants } from '@/lib/tailwindcss/section';
import { sectionVariants } from '@/lib/tailwindcss/section';

import { SectionControls } from './compounds/controls/controls';
import { SectionHeading } from './compounds/heading/heading';
import { SectionSubtext } from './compounds/subtext/subtext';
import { SectionText } from './compounds/text/text';

type DashboardSectionProps = ComponentProps<'section'> & {
  variant?: SectionVariants;
};

export function DashboardSection({
  children,
  className,
  variant = 'default',
  ...props
}: DashboardSectionProps) {
  return (
    <section
      className={twMerge(sectionVariants[variant], className)}
      {...props}
    >
      {children}
    </section>
  );
}

DashboardSection.Heading = SectionHeading;
DashboardSection.Text = SectionText;
DashboardSection.Subtext = SectionSubtext;
DashboardSection.Controls = SectionControls;
