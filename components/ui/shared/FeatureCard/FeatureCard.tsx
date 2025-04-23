import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { Card, CardProps } from '../base/Card/Card';
import { FeatureCardHeading } from './FeatureCardHeading';
import { FeatureCardIcon } from './FeatureCardIcon';

export function FeatureCard({ className, children, ...props }: CardProps) {
  return (
    <Card className={twMerge('@container h-96 w-full', className)} {...props}>
      <div className="flex flex-col items-center justify-start gap-4 @sm:items-start @sm:text-left">
        {children as ReactNode}
      </div>
    </Card>
  );
}

FeatureCard.Icon = FeatureCardIcon;
FeatureCard.Heading = FeatureCardHeading;
