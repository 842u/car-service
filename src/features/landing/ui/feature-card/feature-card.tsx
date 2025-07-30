import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { Card, CardProps } from '@/ui/card/card';

import { Background } from './background';
import { Description } from './description';
import { Heading } from './heading';
import { Icon } from './icon';

export function FeatureCard({ className, children, ...props }: CardProps) {
  return (
    <Card
      className={twMerge('@container h-96 w-full overflow-hidden', className)}
      {...props}
    >
      <div className="flex flex-col items-center justify-start gap-4 text-center @sm:items-start @sm:text-left">
        {children as ReactNode}
      </div>
    </Card>
  );
}

FeatureCard.Icon = Icon;
FeatureCard.Heading = Heading;
FeatureCard.Description = Description;
FeatureCard.Background = Background;
