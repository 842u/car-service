import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { Card, CardProps } from '../../../../features/common/ui/Card/Card';
import { FeatureCardBackground } from './FeatureCardBackground';
import { FeatureCardDescription } from './FeatureCardDescription';
import { FeatureCardHeading } from './FeatureCardHeading';
import { FeatureCardIcon } from './FeatureCardIcon';

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

FeatureCard.Icon = FeatureCardIcon;
FeatureCard.Heading = FeatureCardHeading;
FeatureCard.Description = FeatureCardDescription;
FeatureCard.Background = FeatureCardBackground;
