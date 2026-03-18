import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

type SectionHeadingProps = ComponentProps<'h1'> & {
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  withUnderline?: boolean;
};

export function SectionHeading({
  children,
  className,
  headingLevel = 'h1',
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
