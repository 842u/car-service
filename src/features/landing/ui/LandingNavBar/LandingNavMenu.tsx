import { twMerge } from 'tailwind-merge';

import { ThemeButton } from '@/features/common/ui/theme-button/theme-button';

import { LinkButton } from '../../../common/ui/link-button/link-button';
import { LandingNavMenuItem } from './LandingNavMenuItem';

type LandingNavMenuProps = {
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
};

export function LandingNavMenu({
  isActive = true,
  onClick,
  className,
}: LandingNavMenuProps) {
  return (
    <nav
      aria-label="landing navigation menu"
      className={twMerge(
        'bg-light-500 dark:bg-dark-500 absolute top-0 left-0 flex h-screen w-screen justify-center transition-transform lg:static lg:h-full lg:w-fit lg:translate-x-0 lg:items-center lg:bg-[transparent] lg:text-xs lg:dark:bg-[transparent]',
        isActive ? 'translate-x-0' : '-translate-x-full',
        className,
      )}
      onClick={onClick}
    >
      <ul className="relative flex w-4/5 flex-col items-center justify-center md:w-1/2 lg:w-full lg:flex-row lg:gap-4">
        <LandingNavMenuItem>
          <LinkButton className="my-2" href="/dashboard" variant="accent">
            Dashboard
          </LinkButton>
        </LandingNavMenuItem>
        <LandingNavMenuItem>
          <div className="aspect-square h-10 w-full">
            <ThemeButton className="h-full w-full" />
          </div>
        </LandingNavMenuItem>
      </ul>
    </nav>
  );
}
