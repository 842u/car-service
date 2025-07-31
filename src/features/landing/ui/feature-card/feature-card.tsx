import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import type { CardProps } from '@/ui/card/card';
import { Card } from '@/ui/card/card';

import { FeatureCardBackground } from './compounds/background/background';
import { FeatureCardDescription } from './compounds/description/description';
import { FeatureCardHeading } from './compounds/heading/heading';
import { FeatureCardIcon } from './compounds/icon/icon';

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
