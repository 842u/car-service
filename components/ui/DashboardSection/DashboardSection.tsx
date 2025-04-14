import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import { SectionVariants } from '@/types';
import { sectionVariants } from '@/utils/tailwindcss/section';

type DashboardSectionProps = ComponentProps<'section'> & {
  headingText: string;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  variant?: SectionVariants;
};

export function DashboardSection({
  headingText,
  children,
  className,
  headingLevel = 'h1',
  variant = 'default',
  ...props
}: DashboardSectionProps) {
  const HeadingTag = headingLevel;

  return (
    <section
      className={twMerge(sectionVariants[variant], className)}
      {...props}
    >
      <HeadingTag className="text-lg font-medium">{headingText}</HeadingTag>
      <div className="bg-alpha-grey-200 my-4 h-[1px] w-full" />
      {children}
    </section>
  );
}
