'use client';

import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import type { HeadingLevel } from '@/ui/types/heading-level';

import { useDashboardSection } from '../../section-context';

type SectionHeadingProps = ComponentProps<'h1'> & {
  headingLevel: HeadingLevel;
  withUnderline?: boolean;
};

export function SectionHeading({
  children,
  className,
  headingLevel,
  id,
  withUnderline = true,
  ...props
}: SectionHeadingProps) {
  const { headingId } = useDashboardSection();
  const HeadingTag = headingLevel;

  return (
    <>
      <HeadingTag
        className={twMerge('text-lg font-medium', className)}
        id={id ?? headingId}
        {...props}
      >
        {children}
      </HeadingTag>
      {withUnderline && <div className="bg-alpha-grey-200 my-4 h-px w-full" />}
    </>
  );
}
