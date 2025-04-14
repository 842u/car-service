import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import { SectionVariants } from '@/types';
import { sectionVariants } from '@/utils/tailwindcss/section';

import { DashboardSectionHeading } from './DashboardSectionHeading';

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

DashboardSection.Heading = DashboardSectionHeading;
