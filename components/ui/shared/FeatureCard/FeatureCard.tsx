import { twMerge } from 'tailwind-merge';

import { Card, CardProps } from '../base/Card/Card';
import { FeatureCardIcon } from './FeatureCardIcon';

export function FeatureCard({ className, children, ...props }: CardProps) {
  return (
    <Card className={twMerge('@container h-96 w-full', className)} {...props}>
      {children}
    </Card>
  );
}

FeatureCard.Icon = FeatureCardIcon;
