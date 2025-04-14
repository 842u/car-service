import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

type DashboardSectionHeadingProps = ComponentProps<'h1'> & {
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};

export function DashboardSectionHeading({
  children,
  className,
  headingLevel = 'h1',
  ...props
}: DashboardSectionHeadingProps) {
  const HeadingTag = headingLevel;

  return (
    <>
      <HeadingTag
        className={twMerge('text-lg font-medium', className)}
        {...props}
      >
        {children}
      </HeadingTag>
      <div className="bg-alpha-grey-200 my-4 h-[1px] w-full" />
    </>
  );
}
