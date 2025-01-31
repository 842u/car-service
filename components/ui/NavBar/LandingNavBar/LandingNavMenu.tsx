import { twMerge } from 'tailwind-merge';

import { LinkButton } from '../../LinkButton/LinkButton';
import { ThemeSwitcher } from '../../ThemeSwitcher/ThemeSwitcher';
import { LandingNavMenuItem } from './LandingNavMenuItem';

type LandingNavMenuProps = {
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
};

export function LandingNavMenu({
  isActive = true,
  onClick,
  className = '',
}: LandingNavMenuProps) {
  return (
    // eslint-disable-next-line
    <nav
      aria-label="landing navigation menu"
      className={twMerge(
        'bg-light-500 dark:bg-dark-500 absolute top-0 left-0 flex h-screen w-screen justify-center opacity-0 transition-all lg:static lg:h-full lg:w-auto lg:translate-y-0 lg:items-center lg:justify-center lg:bg-[transparent] lg:text-xs lg:opacity-100 lg:dark:bg-[transparent]',
        isActive ? 'translate-y-0 opacity-100' : '-translate-y-full',
        className,
      )}
      onClick={onClick}
    >
      <ul className="relative flex w-4/5 flex-col items-center justify-center md:w-1/2 lg:w-full lg:flex-row lg:gap-4">
        <LandingNavMenuItem>
          <LinkButton className="my-4 lg:text-xs" href="/dashboard">
            Dashboard
          </LinkButton>
        </LandingNavMenuItem>
        <LandingNavMenuItem>
          <div className="my-4 flex flex-col items-center justify-center lg:w-6">
            <ThemeSwitcher className="w-full" />
          </div>
        </LandingNavMenuItem>
      </ul>
    </nav>
  );
}
