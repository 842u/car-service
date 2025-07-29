import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import { SectionVariants } from '@/types';
import { sectionVariants } from '@/utils/tailwindcss/section';

import { Controls } from './parts/controls';
import { Heading } from './parts/heading';
import { Subtext } from './parts/subtext';
import { Text } from './parts/text';

type SectionProps = ComponentProps<'section'> & {
  variant?: SectionVariants;
};

export function Section({
  children,
  className,
  variant = 'default',
  ...props
}: SectionProps) {
  return (
    <section
      className={twMerge(sectionVariants[variant], className)}
      {...props}
    >
      {children}
    </section>
  );
}

Section.Heading = Heading;
Section.Text = Text;
Section.Subtext = Subtext;
Section.Controls = Controls;
