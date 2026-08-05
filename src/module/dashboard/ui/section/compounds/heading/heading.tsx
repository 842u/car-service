import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import type { HeadingLevel } from '@/ui/types/heading-level';

type SectionHeadingProps = ComponentProps<'h1'> & {
  headingLevel: HeadingLevel;
  withUnderline?: boolean;
};

export function SectionHeading({
  children,
  className,
  headingLevel,
  withUnderline = true,
  ...props
}: SectionHeadingProps) {
  const HeadingTag = headingLevel;

  return (
    <>
      <HeadingTag
        className={twMerge('text-lg font-medium', className)}
        {...props}
      >
        {children}
      </HeadingTag>
      {withUnderline && <div className="bg-alpha-grey-200 my-4 h-px w-full" />}
    </>
  );
}
