import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import { SectionVariants } from '@/types';
import { sectionVariants } from '@/utils/tailwindcss/section';

import { Controls } from './compounds/controls/controls';
import { Heading } from './compounds/heading/heading';
import { Subtext } from './compounds/subtext/subtext';
import { Text } from './compounds/text/text';

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
