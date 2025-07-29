import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import { OAuthButton } from '@/auth/ui/o-auth-button/o-auth-button';

type OAuthProvidersSectionProps = ComponentProps<'section'>;

export function OAuthProvidersSection({
  className,
  ...props
}: OAuthProvidersSectionProps) {
  return (
    <section
      aria-label="OAuth Providers"
      className={twMerge('flex flex-col gap-4', className)}
      {...props}
    >
      <OAuthButton provider="github" />
      <OAuthButton provider="google" />
    </section>
  );
}
