import { twMerge } from 'tailwind-merge';

import { LinkButton } from '../../LinkButton/LinkButton';
import { ThemeSwitcher } from '../../ThemeSwitcher/ThemeSwitcher';

type LandingNavMenuProps = {
  isActive: boolean;
  onClick: () => void;
  className?: string;
};

export function LandingNavMenu({
  isActive,
  onClick,
  className,
}: LandingNavMenuProps) {
  return (
    // eslint-disable-next-line
    <nav
      className={twMerge(
        'absolute left-0 top-0 flex h-screen w-screen justify-center bg-light-500 opacity-0 transition-all dark:bg-dark-500 lg:static lg:h-full lg:w-auto lg:translate-y-0 lg:items-center lg:justify-center lg:bg-[transparent] lg:text-xs lg:opacity-100 lg:dark:bg-[transparent]',
        isActive ? 'translate-y-0 opacity-100' : '-translate-y-full',
        className,
      )}
      onClick={onClick}
    >
      <ul className="relative flex w-4/5 flex-col items-center justify-center md:w-1/2 lg:flex-row-reverse lg:gap-3">
        <li className="w-full before:absolute before:h-[1px] before:w-full before:bg-alpha-grey-500 after:absolute after:h-[1px] after:w-full after:bg-alpha-grey-500 lg:before:hidden lg:after:hidden">
          <div className="my-4 w-full lg:w-6">
            <ThemeSwitcher className="my-4 w-full" />
          </div>
        </li>
        <li className="w-full before:absolute before:h-[1px] before:w-full before:bg-alpha-grey-500 after:absolute after:h-[1px] after:w-full after:bg-alpha-grey-500 lg:before:hidden lg:after:hidden">
          <LinkButton className="my-4 lg:text-xs" href="/dashboard">
            Dashboard
          </LinkButton>
        </li>
        <li className="w-full before:absolute before:h-[1px] before:w-full before:bg-alpha-grey-500 after:absolute after:h-[1px] after:w-full after:bg-alpha-grey-500 lg:before:hidden lg:after:hidden">
          <p className="my-4 text-center">Placeholder</p>
        </li>
      </ul>
    </nav>
  );
}
